import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'app',
})
export default class AppView extends Vue {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Public] Constructor
  // --------------------------------------------------------------------------

  constructor() {
    super();
  }

  // --------------------------------------------------------------------------
  // [Public] Accessors
  // --------------------------------------------------------------------------

  public get layout() {
    const meta = this.$route.meta as { layout?: string } | undefined;

    // Lookup the layout property defined on the route.
    // Fallback to 'default' to load the Default layout otherwise.
    const { layout = 'default' } = meta ?? {};

    // Load the layout component aynchronously
    // (see: https://vuejs.org/v2/guide/components-dynamic-async.html)
    Vue.component(layout, () => import(`@/layouts/${layout}`));

    // Return tag to render: the layout's tag name or plain div as a fallback.
    return layout ?? 'div';
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

  private mounted() {
    // TODO: stuff to do when this component loads.
  }
}
