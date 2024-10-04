import * as path from 'path';
import { AcceptLanguageResolver, I18nOptions, QueryResolver } from 'nestjs-i18n';
import { I18N_CONSTANTS } from '../common/constants';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: I18N_CONSTANTS.FALLBACK_LANGUAGE,
  loaderOptions: {
    path: path.join(__dirname, I18N_CONSTANTS.I18N_PATH),
    watch: true,
  },
  resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
};
