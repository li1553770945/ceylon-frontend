import { expect, test, type Page } from "@playwright/test";

const session = {
  authenticated: true,
  user: {
    id: "user-1",
    email: "alice@example.com",
  },
  profile: {
    id: "user-1",
    email: "alice@example.com",
    display_name: "Alice",
    avatar_url: null,
    role: "admin",
    subscription_tier: "pro",
  },
  permissions: {
    is_admin: true,
  },
};

async function mockSession(page: Page) {
  await page.route("http://localhost:8000/api/v1/auth/session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(session),
    })
  );
}

test.beforeEach(async ({ page }) => {
  await mockSession(page);
});

test("dashboard project and requirement view cover the P0 workspace path", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "项目列表" })).toBeVisible();
  await page.getByPlaceholder("搜索项目...").fill("前端");
  await expect(page.getByText("CEYLON 前端重构")).toBeVisible();

  await page.getByText("CEYLON 前端重构").click();
  await expect(page.getByRole("heading", { name: "CEYLON 前端重构" })).toBeVisible();
  await page.getByText("v1.0 MVP").click();

  await expect(page.getByRole("heading", { name: "v1.0 MVP 需求" })).toBeVisible();
  await expect(page.getByText("完成登录注册闭环")).toBeVisible();

  await page.getByRole("button", { name: "新建需求" }).click();
  await expect(page.getByText("新需求 4")).toBeVisible();

  await page.getByText("完成登录注册闭环").click();
  await page.locator('input[value="完成登录注册闭环"]').fill("完成登录注册闭环（已迁移）");
  await page.locator('input[value="完成登录注册闭环（已迁移）"]').press("Enter");
  await expect(page.getByText("完成登录注册闭环（已迁移）")).toBeVisible();

  await page.getByRole("button", { name: "筛选" }).click();
  await expect(page.getByText("当前仅显示未完成需求")).toBeVisible();
  await expect(page.getByText("团队成员权限管理")).toHaveCount(0);
});

test("requirement view supports custom columns and import preview", async ({
  page,
}) => {
  await page.goto("/dashboard/project/proj-1/view/view-1");

  await page.getByLabel("新列名").fill("验收人");
  await page.getByRole("button", { name: "新增列" }).click();
  await expect(page.getByText("已新增自定义列：验收人")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "验收人" })).toBeVisible();

  await page.getByLabel("删除列 验收人").click();
  await expect(page.getByRole("columnheader", { name: "验收人" })).toHaveCount(0);

  await page.getByRole("button", { name: "导入" }).click();
  await expect(page.getByRole("heading", { name: "导入需求" })).toBeVisible();
  await expect(page.getByText("字段映射规则")).toBeVisible();
});

test("account pages cover profile, cli tokens and subscription", async ({
  page,
}) => {
  await page.goto("/profile");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "个人资料" })
  ).toBeVisible();
  await page.getByLabel("显示名称").fill("Alice Product");
  await page.getByRole("button", { name: "保存资料" }).click();
  await expect(page.getByText("资料已更新")).toBeVisible();

  await page.goto("/settings");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "账号设置" })
  ).toBeVisible();
  await page.getByLabel("Token 名称").fill("Local CLI");
  await page.getByRole("button", { name: "创建 Token" }).click();
  await expect(page.getByText("Token 仅展示一次")).toBeVisible();
  await expect(page.getByText("Local CLI")).toBeVisible();

  await page.goto("/dashboard/subscription");
  await expect(
    page.getByRole("main").getByRole("heading", { name: "订阅信息" })
  ).toBeVisible();
  await expect(page.locator("p.uppercase").filter({ hasText: "pro" })).toBeVisible();
  await expect(page.getByText("CLI Token")).toBeVisible();
});
