import { G, Ellipse, Line } from '../tags';
import Timeline from '../Timeline';
import { ViewportHoverEvent } from '../events';
import RenderContext from '../RenderContext';
import Plugin from '../Plugin';

/**
 * Mouse tracker for non-mobile devices.
 */
export default class LocationTracker extends Plugin {

  static get type() {
    return 'LocationTracker';
  }

  static get rules() {
    return {
      knobColor: '#ccc',
      knobRadius: 3,
      lineColor: '#ccc',
      lineWidth: '1px',
      lineOpacity: 0.6,
      dark: {
        lineColor: 'grey',
      },
    };
  }

  private trackerId: string = Timeline.nextId();
  private hoverListener: ((event: ViewportHoverEvent) => any);

  renderViewportXOverlay(ctx: RenderContext) {
    return new G({
      id: this.trackerId,
      style: 'visibility: hidden',
    }).addChild(
      new Line({
        x1: ctx.x - this.style.knobRadius,
        y1: this.style.knobRadius,
        x2: 0,
        y2: ctx.totalHeight - this.style.knobRadius,
        stroke: this.style.lineColor,
        'stroke-width': this.style.lineWidth,
        'stroke-opacity': this.style.lineOpacity,
        'stroke-dasharray': '4 3',
        'pointer-events': 'none',
      }),
      new Ellipse({
        cx: ctx.x - this.style.knobRadius,
        cy: 0,
        rx: this.style.knobRadius,
        ry: this.style.knobRadius,
        fill: this.style.lineColor,
        'pointer-events': 'none',
      }),
      new Ellipse({
        cx: ctx.x - this.style.knobRadius,
        cy: ctx.totalHeight,
        rx: this.style.knobRadius,
        ry: this.style.knobRadius,
        fill: this.style.lineColor,
        'pointer-events': 'none',
      }),
    );
  }

  postRender(ctx: RenderContext, svgEl: any) {
    const locationTrackerEl = svgEl.getElementById(this.trackerId);

    this.hoverListener = function(event: ViewportHoverEvent) {
      if (!locationTrackerEl) {
        return;
      }

      if (event.x !== undefined) {
        const x = event.x + ctx.sidebarWidth; // overlay uses the entire space
        locationTrackerEl.childNodes[0].setAttribute('x1', x);
        locationTrackerEl.childNodes[0].setAttribute('x2', x);
        locationTrackerEl.childNodes[1].setAttribute('cx', x);
        locationTrackerEl.childNodes[2].setAttribute('cx', x);
        locationTrackerEl.style.visibility = 'visible';
      } else {
        locationTrackerEl.style.visibility = 'hidden';
      }
    };

    this.timeline.on('viewportHover', this.hoverListener);
  }

  tearDown() {
    this.timeline.off('viewportHover', this.hoverListener);
  }
}
