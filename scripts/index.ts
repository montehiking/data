import { promises } from 'fs';
import { join, sep } from 'path';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { readdir, writeFile } = promises;

type FileName = {
  category: string;
  id: string;
  path: string;
  type: string;
};

const ROOT = 'docs';
const LOCALES = ['en', 'hbs', 'ru'] as const;

const getFilenames = async (directory: string): Promise<FileName[]> => {
  const files: FileName[] = [];
  const listing = await readdir(directory, { withFileTypes: true });

  for (const item of listing) {
    const path = join(directory, item.name);

    if (!item.isFile()) {
      files.push(...(await getFilenames(path)));
    } else if (path.endsWith('index.json')) {
      const [_, id, category, type] = path.split(sep).reverse();

      files.push({ category, id, path, type });
    }
  }

  return files;
};

(async () => {
  const filenames = await getFilenames(ROOT);

  const files = filenames.map((item) => ({
    ...item,
    file: require(join('..', item.path)),
  }));

  const data = LOCALES.map((locale) => ({
    locale,
    content: {
      type: 'FeatureCollection',
      features: files.map(({ file, category, id, type }) => ({
        type: 'Feature',
        geometry: {
          type: category === 'trails' ? 'LineString' : 'Point',
          coordinates: file.coordinates,
        },
        properties: {
          name: file.name[locale],
          description: file.description[locale],
          category,
          notVerified: file.verified ? undefined : true,
          path: `/${type}/${category}/${id}/`,
        },
      })),
    },
  }));

  await Promise.all(
    data.map(({ locale, content }) => {
      const path = join(ROOT, `${locale}.json`);
      const text = JSON.stringify(content);

      return writeFile(path, text);
    })
  );
})();
