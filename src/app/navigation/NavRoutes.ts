export const URL_PREFIX = "/ipa/modern_ui";

export const navigationRoutes = [
  {
    label: "Identity",
    items: [
      {
        label: "Users",
        items: [
          {
            label: "Active users",
            url: `${URL_PREFIX}/active-users`,
            items: [
              {
                label: "Active users Settings",
                url: `${URL_PREFIX}/active-users/settings`,
              },
            ],
          },
          {
            label: "Stage users",
            url: `${URL_PREFIX}/stage-users`,
          },
          {
            label: "Preserved users",
            url: `${URL_PREFIX}/preserved-users`,
          },
        ],
      },
      // {
      //   label: "Hosts",
      //   items: [],
      //   url: `${URL_PREFIX}/active-users`,
      // },
      // {
      //   label: "Services",
      //   items: [],
      //   url: `${URL_PREFIX}/active-users`,
      // },
      // {
      //   label: "Groups",
      //   items: [],
      // },
      // {
      //   label: "ID views",
      //   items: [],
      //   url: `${URL_PREFIX}/active-users`,
      // },
      // {
      //   label: "Automember",
      //   items: [
      //     {
      //       label: "User Group Rules",
      //       url: `${URL_PREFIX}/active-users`,
      //     },
      //     {
      //       label: "Host Group Rules",
      //       url: `${URL_PREFIX}/stage-users`,
      //     },
      //   ],
      // },
    ],
  },
];
