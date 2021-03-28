import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component({
  components: {},
  name: 'app',
})
export default class AppView extends Vue {

  // --------------------------------------------------------------------------
  // [Public] Accessors
  // --------------------------------------------------------------------------

  public static async loadLayout(route: Route) {
    const meta = route.meta as { layout?: string } | undefined;

    // Lookup the layout property defined on the route.
    // Fallback to 'default' to load the Default layout otherwise.
    const { layout = 'default' } = meta ?? {};

    // Load the layout component aynchronously
    // (see: https://vuejs.org/v2/guide/components-dynamic-async.html)
    const component = await import(`@/layouts/${layout}`);
    Vue.component(layout, component.default);

    // Return tag to render: the layout's tag name or plain div as a fallback.
    return layout ?? 'div';
  }

  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------
  private layout: string | null = null;

  // --------------------------------------------------------------------------
  // [Public] Constructor
  // --------------------------------------------------------------------------
  constructor() {
    super();
  }

  // --------------------------------------------------------------------------
  // [Public] Methods
  // --------------------------------------------------------------------------

  public navigateTo(path: string) {
    // this.$router.push({ path });
  }

  // --------------------------------------------------------------------------
  // [Private] Event Handlers
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Private] Methods
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Private] Lifecycle Hooks
  // --------------------------------------------------------------------------

  private async mounted() {
    const { $route, $router } = this;

    // Update layout on subsequent navigation events.
    $router.beforeResolve(async (to, from, next) => {
      // Clear existing layout.
      this.layout = null;

      // Update UI immediately to show loader. May not be visible if the
      // Layout was previously cached and is able to load quickly.
      this.$forceUpdate();

      // Load layout. Value will come from cache after first load of a Layout.
      this.layout = await AppView.loadLayout(to);

      next();
    });

    this.layout = await AppView.loadLayout($route);
  }
}
