import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { Model } from "@/resources/interfaces";
import Resource from "@/resources/Resource";
import { Pagination } from "@/components";

@Component({
  components: {
    Pagination
  }
})
export default class List<M extends Model> extends Vue {
  resource: Resource<M> | null = null;
  name = "list";
  autoCompletes: { key: string; minLength: number }[] = [];
  currentSort = "createdAt";
  currentSortOrder = "desc";
  pagination = {
    perPage: 10,
    currentPage: 1,
    total: 0
  };
  searchQuery: Record<string, any> = {};
  searchDelayTimeout = 0;
  queriedData: M[] & { $headers: Record<string, string> } = Object.assign(
    { $headers: {} },
    []
  );
  minQueryInterval = 100;
  queryCoolingDown = false;
  activated() {
    this.queryData();
  }
  get query() {
    const searchQuery: Record<string, any> = {
      ...this.searchQuery,
      limit: this.pagination.perPage,
      skip: (this.pagination.currentPage - 1) * this.pagination.perPage,
      order: this.currentSort
        ? `${this.currentSortOrder === "desc" ? "-" : ""}${this.currentSort}`
        : undefined
    };

    for (const autoComplete of this.autoCompletes) {
      if (
        searchQuery[autoComplete.key] &&
        searchQuery[autoComplete.key].length < autoComplete.minLength
      ) {
        delete searchQuery[autoComplete.key];
      }
    }

    for (const field of Object.keys(searchQuery) as Array<
      keyof typeof searchQuery
    >) {
      const value = searchQuery[field];
      if (value instanceof Array) {
        (searchQuery[field] as string) = value.join(",");
      }
    }

    return searchQuery;
  }
  get from() {
    return Math.min(
      this.pagination.perPage * (this.pagination.currentPage - 1) + 1,
      this.total
    );
  }
  get to() {
    return Math.min(this.from + this.pagination.perPage - 1, this.total);
  }
  get total() {
    return this.pagination.total;
  }
  async queryData(): Promise<
    (M[] & { $headers: Record<string, string> }) | undefined
  > {
    if (this.queryCoolingDown) return;
    this.queryCoolingDown = true;
    setTimeout(() => {
      this.queryCoolingDown = false;
    }, this.minQueryInterval);
    if (!this.resource) throw Error("invalid_resource");
    this.queriedData = await this.resource.query(this.query);
    this.pagination.total = Number(this.queriedData.$headers["items-total"]);
    return this.queriedData;
  }
  showDetail(item: M) {
    this.$router.push(`/${this.name}/${item.id}`);
  }
  showCreate() {
    this.$router.push(`/${this.name}/add`);
  }
  @Watch("pagination.currentPage")
  onCurrentPageUpdate() {
    this.queryData();
  }
  @Watch("searchQuery", { deep: true })
  onSearchQueryUpdate() {
    clearTimeout(this.searchDelayTimeout);
    this.searchDelayTimeout = setTimeout(() => {
      this.queryData();
    }, 200);
  }
  @Watch("currentSort")
  onCurrentSortUpdate() {
    this.queryData();
  }
  @Watch("currentSortOrder")
  onCurrentSortOrderUpdate() {
    this.queryData();
  }
}
