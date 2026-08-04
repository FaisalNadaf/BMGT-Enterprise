import { site } from '../data/site'

/** Slim contact strip above the header. Phone · email · location. */
export function TopBar() {
  return (
    <div className="topbar">
      {/* Actions left, location right. A single dot-separated run pushed the
          address into the middle of the bar, where it read as a third link. */}
      <div className="container topbar__inner">
        <div className="topbar__group">
          <a className="topbar__item" href={site.phone.href}>
            {site.phone.display}
          </a>
          <span className="topbar__sep" aria-hidden="true">
            ·
          </span>
          <a className="topbar__item" href={`mailto:${site.emails.sales}`}>
            {site.emails.sales}
          </a>
        </div>
        <span className="topbar__item topbar__item--wide">{site.address.short}</span>
      </div>
    </div>
  )
}
