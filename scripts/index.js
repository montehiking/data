import { promises } from 'fs';
import { createRequire } from 'module';
import { join, sep } from 'path';
import prettier from 'prettier';

const { readdir, writeFile } = promises;

const ROOT = 'docs';
const LOCALES = ['en', 'hbs', 'ru'];

const require = createRequire(import.meta.url);
const data = {};

const getFilenames = async (directory) => {
  const files = [];
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
  const [filenames, prettierOptions] = await Promise.all([
    getFilenames(ROOT),
    prettier.resolveConfig(process.cwd()),
  ]);

  const files = filenames.map((item) => ({
    ...item,
    file: require(join('..', item.path)),
  }));

  files.forEach(({ file, category, id, type }) => {
    LOCALES.forEach((locale) => {
      const key = `${type}${sep}${locale}.json`;

      if (!data[key]) {
        data[key] = { type: 'FeatureCollection', features: [] };
      }

      data[key].features.push({
        type: 'Feature',
        geometry: {
          type: type === 'trails' ? 'LineString' : 'Point',
          coordinates: file.coordinates,
        },
        properties: {
          name: file.name[locale],
          description: file.description[locale],
          category,
          notVerified: file.verified ? undefined : true,
          path: `/${type}/${category}/${id}/`,
        },
      });
    });
  });

  await Promise.all(
    Object.keys(data).map((key) => {
      const path = join(ROOT, key);
      const text = prettier.format(JSON.stringify(data[key], null), {
        ...prettierOptions,
        parser: 'json',
      });

      return writeFile(path, text);
    })
  );
})();
