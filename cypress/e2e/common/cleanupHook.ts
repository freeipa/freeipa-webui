import { Before } from "@badeball/cypress-cucumber-preprocessor";

const echoToTerminal = (message: string) => {
  const escaped = message.replace(/"/g, '\\"');
  cy.exec(
    `echo "${escaped}" >> /home/vmiticka/Programming/freeipa-webui/cypress/support/logs.log`
  );
};

export const cleanup = (
  commands_find: string[],
  commands_delete: string[],
  omit: string[]
) => {
  const command = commands_find.join(" ");
  echoToTerminal(
    `cleanup starting: find=[${command}] delete=[${commands_delete.join(" ")}] omit=[${omit}]`
  );
  cy.ipa(command, undefined, {
    failOnNonZeroExit: false,
  }).then((result) => {
    const items: string[] = result.stdout
      .split("\n")
      .map((line) => line.split(":")[1]?.trim() || "")
      .filter((u) => u.length > 0 && !omit.includes(u));

    const sample = items.slice(0, 10);
    const suffix = items.length > 10 ? " ..." : "";
    echoToTerminal(
      `about to delete ${items.length} item(s): ${sample.join(", ")}${suffix}`
    );

    //items.forEach((u) => {
    // cy.ipa(commands_delete.join(" "), u, { failOnNonZeroExit: false });
    // });

    echoToTerminal(
      `done cleanup: delete=[${commands_delete.join(" ")}] total=${items.length}`
    );
  });
};

// Special-case cleanup for services: keep core principals for the test server
const cleanupServices = () => {
  const host = Cypress.env("SERVER_NAME") as string;
  const keepPrefixes = [
    `HTTP/${host}`,
    `DNS/${host}`,
    `dogtag/${host}`,
    `ipa-dnskeysyncd/${host}`,
    `ldap/${host}`,
  ];

  echoToTerminal(
    `cleanup starting: services keep=[${keepPrefixes.join(", ")}]`
  );

  cy.exec(`podman exec webui ipa service-find --pkey-only`, {
    failOnNonZeroExit: false,
  }).then((result) => {
    const items: string[] = result.stdout
      .split("\n")
      .map((line) => line.split(":")[1]?.trim() || "")
      .filter(
        (u) =>
          u.length > 0 && !keepPrefixes.some((prefix) => u.startsWith(prefix))
      );

    const sample = items.slice(0, 10);
    const suffix = items.length > 10 ? " ..." : "";
    echoToTerminal(
      `about to delete ${items.length} service(s): ${sample.join(", ")}${suffix}`
    );

    items.forEach((u) => {
      cy.ipa("service-del", u, { failOnNonZeroExit: false });
    });

    echoToTerminal(`done cleanup: service-del total=${items.length}`);
  });
};

Before(() => {
  cy.log("running cleanup");
  cleanup(["automember-find", "--pkey-only"], ["automember-del"], []);
  cleanup(["certmaprule-find", "--pkey-only"], ["certmaprule-del"], []);
  cleanup(["dnsforwardzone-find", "--pkey-only"], ["dnsforwardzone-del"], []);
  cleanup(["dnsrecord-find", "--pkey-only"], ["dnsrecord-del"], []);
  cleanup(["dnszone-find", "--pkey-only"], ["dnszone-del"], []);
  cleanup(
    ["group-find", "--pkey-only"],
    ["group-del"],
    ["admins", "editors", "ipausers", "trust admins"]
  );
  cleanup(["hbacrule-find", "--pkey-only"], ["hbacrule-del"], []);
  cleanup(["hbacsvc-find", "--pkey-only"], ["hbacsvc-del"], []);
  cleanup(["hbacsvcgroup-find", "--pkey-only"], ["hbacsvcgroup-del"], []);
  cleanup(["host-find", "--pkey-only"], ["host-del"], []);
  cleanup(["hostgroup-find", "--pkey-only"], ["hostgroup-del"], []);
  cleanup(["idoverridegroup-find", "--pkey-only"], ["idoverridegroup-del"], []);
  cleanup(["idoverrideuser-find", "--pkey-only"], ["idoverrideuser-del"], []);
  cleanup(["idp-find", "--pkey-only"], ["idp-del"], []);
  cleanup(["idrange-find", "--pkey-only"], ["idrange-del"], []);
  cleanup(["idview-find", "--pkey-only"], ["idview-del"], []);
  cleanup(["netgroup-find", "--pkey-only"], ["netgroup-del"], []);
  cleanup(["pwpolicy-find", "--pkey-only"], ["pwpolicy-del"], []);
  cleanupServices();
  cleanup(["stageuser-find", "--pkey-only"], ["stageuser-del"], []);
  cleanup(["sudocmd-find", "--pkey-only"], ["sudocmd-del"], []);
  cleanup(["sudocmdgroup-find", "--pkey-only"], ["sudocmdgroup-del"], []);
  cleanup(["sudorule-find", "--pkey-only"], ["sudorule-del"], []);
  cleanup(["trust-find", "--pkey-only"], ["trust-del"], []);
  cleanup(["user-find", "--pkey-only"], ["user-del"], ["admin"]);
});
