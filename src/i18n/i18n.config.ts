import { join } from 'path';
import { AcceptLanguageResolver, I18nOptions, QueryResolver } from 'nestjs-i18n';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'fr',
  loaderOptions: {
    path: join(__dirname, '../i18n'),
    watch: true,
  },
  resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
  typesOutputPath: join(__dirname, 'src/generated/i18n.generated.ts'),
};
