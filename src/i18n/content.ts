import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { products as rawProducts, type Product } from '../data/products'
import { industries as rawIndustries, type Industry } from '../data/industries'
import { brands as rawBrands, type Brand } from '../data/brands'
import { site } from '../data/site'
import { slugKey } from './useLocale'

/**
 * Content data, translated.
 *
 * `src/data/*.ts` stays the single source of truth for structure — slugs,
 * image paths, which products feed which sector — and for the English text,
 * which `scripts/gen-en.mjs` lifts into en.json. These hooks put the active
 * locale's strings back on the same objects, so components keep reading
 * `product.name` and never learn that a translation layer exists.
 *
 * Keys are built from the **English** name (`slugKey`), which is why the raw
 * array rather than the translated one is always the thing being mapped.
 */

export function useProducts(): Product[] {
  const { t } = useTranslation()
  return useMemo(
    () =>
      rawProducts.map((p) => {
        const k = `content.products.${p.slug}`
        return {
          ...p,
          name: t(`${k}.name`),
          shortName: t(`${k}.shortName`),
          blurb: t(`${k}.blurb`),
          intro: t(`${k}.intro`),
          detail: t(`${k}.detail`),
          capabilities: t(`${k}.capabilities`, { returnObjects: true }) as string[],
          subProducts: p.subProducts.map((s) => {
            const sk = `${k}.sub.${slugKey(s.name)}`
            return { ...s, name: t(`${sk}.name`), line: t(`${sk}.line`) }
          }),
        }
      }),
    [t],
  )
}

export function useProduct(slug: string): Product | undefined {
  return useProducts().find((p) => p.slug === slug)
}

function translateIndustry(t: ReturnType<typeof useTranslation>['t'], i: Industry): Industry {
  const k = `content.industries.${i.slug}`
  return {
    ...i,
    name: t(`${k}.name`),
    shortName: t(`${k}.shortName`),
    blurb: t(`${k}.blurb`),
    lead: t(`${k}.lead`),
    detail: t(`${k}.detail`),
    points: t(`${k}.points`, { returnObjects: true }) as string[],
    why: i.why.map((_, n) => ({
      title: t(`${k}.why.${n}.title`),
      body: t(`${k}.why.${n}.body`),
    })),
    children: i.children?.map((c) => translateIndustry(t, c)),
  }
}

export function useIndustries(): Industry[] {
  const { t } = useTranslation()
  return useMemo(() => rawIndustries.map((i) => translateIndustry(t, i)), [t])
}

export function useIndustry(slug: string, parentSlug?: string): Industry | undefined {
  const list = useIndustries()
  const parent = list.find((i) => i.slug === (parentSlug ?? slug))
  if (!parent) return undefined
  return parentSlug ? parent.children?.find((c) => c.slug === slug) : parent
}

/** Brand *names* are trademarks and stay Latin; only the category label moves. */
export function useBrands(): Brand[] {
  const { t } = useTranslation()
  return useMemo(
    () => rawBrands.map((b) => ({ ...b, field: t(`content.brands.${slugKey(b.name)}.field`) })),
    [t],
  )
}

export function useBrandsNote(): string {
  const { t } = useTranslation()
  return t('content.brands.note')
}

/** Phone, emails and URLs are never translated — only prose and the address. */
export function useSite() {
  const { t } = useTranslation()
  return useMemo(
    () => ({
      ...site,
      tagline: t('content.site.tagline'),
      description: t('content.site.description'),
      address: {
        ...site.address,
        short: t('content.site.addressShort'),
        lines: t('content.site.addressLines', { returnObjects: true }) as string[],
      },
    }),
    [t],
  )
}
