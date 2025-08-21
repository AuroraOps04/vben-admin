declare module '*.vue' {}

declare namespace API {
  type PageParams = {
    page?: number;
    size?: number;
  };

  type PageResult<T> = {
    count: number;
    results: T[];
  };
  type MenuMeta = {
    activeIcon?: string;
    activePath?: string;
    affixTab?: boolean;
    affixTabOrder?: number;
    badge?: string;
    badgeType?: 'dot' | 'normal';
    badgeVariants?: string;
    fullPathKey?: boolean;
    hideChildrenInMenu?: boolean;
    hideInBreadCrumb?: boolean;
    hideInMenu?: boolean;
    hideInTab?: boolean;
    icon?: string;
    iframeSrc?: string;
    ignoreAccess?: boolean;
    keepAlive?: boolean;
    link?: string;
    order?: number;
    title: string;
  };

  type Menu = {
    component: string;
    id?: number;
    meta: MenuMeta;
    name: string;
    parent?: Menu;
    path: string;
    redirect?: string;
    status: boolean;
    type: 'button' | 'catelog' | 'iframe' | 'link' | 'page';
    typeDisplay?: string;
  };
  type TreeMenu = Menu & {
    children: TreeMenu[];
  };
}
