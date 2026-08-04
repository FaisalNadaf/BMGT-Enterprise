import { Link } from 'react-router-dom'
import { StaggerItem } from './Reveal'
import { useImageReveal } from '../lib/useImageReveal'
import type { Product } from '../data/products'
import { productPath } from '../data/products'

type Props = {
  product: Product
  /** Grid span class suffix — the home tile grid is not a uniform grid. */
  span: 'feature' | 'span3' | 'span4'
  /** The first row is above the fold on most screens; the rest lazy-load. */
  eager?: boolean
}

/**
 * One photographic tile in the home index. The parallelogram clip and the
 * flush-edge rules live in CSS (they depend on nth-child position), so this
 * component only supplies content and the grid span.
 */
export function ProductTile({ product, span, eager = false }: Props) {
  /* Eager tiles are the first row, already painted before any scroll — fading
     those in is how a hero starts to feel slow rather than polished. */
  const img = useImageReveal(eager)

  return (
    <StaggerItem as="li" className={`tile tile--${span}`}>
      <Link className="tile__link" to={productPath(product)}>
        <span className="tile__media">
          <img
            className={`tile__img ${img.className}`}
            src={product.image}
            width={900}
            height={600}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            alt=""
            {...img.props}
          />
        </span>
        <h3 className="tile__label">{product.name}</h3>
      </Link>
    </StaggerItem>
  )
}
