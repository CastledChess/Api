import * as path from 'path';
import { AcceptLanguageResolver, I18nOptions, QueryResolver } from 'nestjs-i18n';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'fr',
  loaderOptions: {
    path: path.join(__dirname, '../i18/'),
    watch: true,
  },
  resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
};
