const state = {
  lastDrawerId: "",
};

const drawerData = {
  occupied: {
    title: "占用库存详情",
    subtitle: "包含单据流转到仓库预占用、仓库生成拣货任务未拣货、已拣货未出库的库存",
    tabs: [
      { key: "docs", label: "占用单据" },
      { key: "stock", label: "占用汇总" },
    ],
    render: (sku) => ({
      docs: `
        <h3 class="section-title">${sku} · 占用单据</h3>
        <table class="inner-table">
          <thead>
            <tr>
              <th>单据类型</th><th>单据号</th><th>占用货位</th><th>占用数量</th><th>已拣下数量</th><th>未拣数量</th><th>占用时间</th><th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>仓库预占用</td>
              <td><a class="link" data-action="open-doc" data-doc="SO-20260515-0006">SO-20260515-0006</a></td>
              <td>待分配</td><td>1</td><td>0</td><td>1</td><td>2026-05-15 08:30</td><td><span class="tag tag--processing">已流转仓库</span></td>
            </tr>
            <tr>
              <td>销售出库单</td>
              <td><a class="link" data-action="open-doc" data-doc="SO-20260515-0008">SO-20260515-0008</a></td>
              <td>4D10-B0308</td><td>1</td><td>1</td><td>0</td><td>2026-05-15 09:10</td><td><span class="tag tag--processing">待出库</span></td>
            </tr>
            <tr>
              <td>拣货任务</td>
              <td><a class="link" data-action="open-doc" data-doc="PK-20260515-0032">PK-20260515-0032</a></td>
              <td>4B19-B0442</td><td>20</td><td>0</td><td>20</td><td>2026-05-15 09:08</td><td><span class="tag tag--warning">待拣货</span></td>
            </tr>
            <tr>
              <td>拣货缺货占用</td>
              <td><a class="link" data-action="open-doc" data-doc="PK-20260515-0028">PK-20260515-0028</a></td>
              <td>LP01-0222</td><td>3</td><td>2</td><td>1</td><td>2026-05-15 08:46</td><td><span class="tag tag--warning">缺货占用</span></td>
            </tr>
          </tbody>
        </table>
      `,
      stock: `
        <h3 class="section-title">占用汇总</h3>
        <dl class="desc-grid">
          <dt>SKU</dt><dd>${sku}</dd>
          <dt>占用总数</dt><dd>3</dd>
          <dt>仓库预占用</dt><dd>1</dd>
          <dt>待拣货占用</dt><dd>1</dd>
          <dt>已拣未出库</dt><dd>1</dd>
          <dt>最早占用时间</dt><dd>2026-05-15 08:30</dd>
          <dt>占用口径</dt><dd>单据流转到仓库预占用、仓库生成拣货任务还没拣货的，以及仓库拣货下来还没出库的库存数量。</dd>
        </dl>
      `,
    }),
  },
  pending: {
    title: "待上架详情",
    subtitle: "区分入库待上架与还货待上架的库存口径",
    tabs: [
      { key: "list", label: "待上架明细" },
      { key: "rule", label: "计算口径" },
    ],
    render: (sku) => ({
      list: `
        <h3 class="section-title">${sku} · 待上架明细</h3>
        <table class="inner-table">
          <thead>
            <tr>
              <th>来源类型</th><th>单据号</th><th>数量</th><th>是否计入可用库存</th><th>移动货位</th><th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>入库上架</td>
              <td><a class="link" data-action="open-doc" data-doc="IN-20260515-0018">IN-20260515-0018</a></td>
              <td>1</td><td>否</td><td>4B19-B0442</td><td><span class="tag tag--processing">待上架</span></td>
            </tr>
            <tr>
              <td>拣货后还货</td>
              <td><a class="link" data-action="open-doc" data-doc="RTS-20260515-0011">RTS-20260515-0011</a></td>
              <td>1</td><td>是</td><td>LP01-0222</td><td><span class="tag tag--warning">待还货上架</span></td>
            </tr>
          </tbody>
        </table>
      `,
      rule: `
        <div class="formula-box">待上架库存 = 入库待上架 + 拣货后还货待上架；拣货缺货占用归入占用库存，不归入待上架库存。</div>
        <table class="inner-table">
          <thead><tr><th>来源</th><th>计入待上架库存</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>入库待上架</td><td>是</td><td>正常入库后待上架的数据</td></tr>
            <tr><td>拣货后还货待上架</td><td>是</td><td>已拣货但需还回货位的数据</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  locked: {
    title: "锁定库存详情",
    subtitle: "暂不计算拣货缺货，拣货缺货仍归入占用库存",
    tabs: [
      { key: "list", label: "锁定单据" },
      { key: "rule", label: "锁定口径" },
    ],
    render: (sku) => ({
      list: `
        <h3 class="section-title">${sku} · 锁定单据</h3>
        <table class="inner-table">
          <thead>
            <tr><th>拣货单号</th><th>库位编码</th><th>锁定数量</th><th>锁定时间</th><th>锁定原因</th><th>处理状态</th></tr>
          </thead>
          <tbody>
            <tr><td colspan="6" class="empty-cell">暂无计入锁定库存的单据；拣货缺货仍在占用库存中查看。</td></tr>
          </tbody>
        </table>
      `,
      rule: `
        <div class="formula-box">当前锁定库存暂不计算拣货缺货。拣货缺货产生的临时异常仍归入占用库存，避免和单据占用重复计算。</div>
        <table class="inner-table">
          <thead><tr><th>字段</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>锁定库存</td><td>后续仅用于独立冻结、盘点冻结等非拣货缺货场景。</td></tr>
            <tr><td>拣货缺货</td><td>仍在占用库存明细中展示，不进入锁定库存字段。</td></tr>
            <tr><td>展示规则</td><td>没有非缺货锁定单据时，锁定显示为 0。</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  location: {
    title: "货位库存明细",
    subtitle: "总库存口径下的全部货位库存，包含良品货位与次品货位",
    tabs: [
      { key: "detail", label: "货位明细" },
      { key: "flow", label: "库存流水" },
    ],
    render: (sku) => ({
      detail: `
        <h3 class="section-title">${sku} · 货位库存</h3>
        <table class="inner-table">
          <thead><tr><th>货位编码</th><th>总库存</th><th>可用库存</th><th>占用库存</th><th>锁定</th><th>是否计入良品储位库存</th><th>最后变动时间</th></tr></thead>
          <tbody>
            <tr><td>4C20-A0326</td><td>11</td><td>11</td><td><a class="link occupied-value" data-action="open-occupied" data-sku="${sku}">3</a></td><td><a class="link lock-value" data-action="open-locked" data-sku="${sku}">0</a></td><td><span class="tag tag--success">是</span></td><td>2026-05-15 09:32</td></tr>
            <tr><td>4D20-A0111 <span class="defect-badge">次</span></td><td>2</td><td>2</td><td><a class="link occupied-value" data-action="open-occupied" data-sku="${sku}">0</a></td><td><a class="link lock-value" data-action="open-locked" data-sku="${sku}">0</a></td><td><span class="tag tag--warning">否</span></td><td>2026-05-15 09:18</td></tr>
          </tbody>
        </table>
      `,
      flow: `
        <h3 class="section-title">库存流水</h3>
        <table class="inner-table">
          <thead><tr><th>操作时间</th><th>操作单据号</th><th>操作类型</th><th>货位</th><th>数量</th></tr></thead>
          <tbody>
            <tr><td>2026-05-15 09:10</td><td><a class="link" data-action="open-doc" data-doc="PK-20260515-0032">PK-20260515-0032</a></td><td>生成拣货任务</td><td>4D10-B0308</td><td>1</td></tr>
            <tr><td>2026-05-15 09:32</td><td><a class="link" data-action="open-doc" data-doc="PK-20260515-0032">PK-20260515-0032</a></td><td>拣货下架</td><td>4D10-B0308</td><td>-1</td></tr>
            <tr><td>待发生</td><td><a class="link" data-action="open-doc" data-doc="SO-20260515-0008">SO-20260515-0008</a></td><td>出库完成</td><td>MOVE-01</td><td>-1</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  goodLocation: {
    title: "良品储位库存明细",
    subtitle: "仅展示计入良品储位库存的货位，不展示次品货位库存",
    tabs: [
      { key: "detail", label: "良品货位" },
      { key: "rule", label: "计算口径" },
    ],
    render: (sku) => ({
      detail: `
        <h3 class="section-title">${sku} · 良品储位库存</h3>
        <table class="inner-table">
          <thead><tr><th>货位编码</th><th>总库存</th><th>可用库存</th><th>占用库存</th><th>锁定</th><th>是否计入良品储位库存</th><th>最后变动时间</th></tr></thead>
          <tbody>
            <tr><td>4C20-A0326</td><td>11</td><td>11</td><td><a class="link occupied-value" data-action="open-occupied" data-sku="${sku}">3</a></td><td><a class="link lock-value" data-action="open-locked" data-sku="${sku}">0</a></td><td><span class="tag tag--success">是</span></td><td>2026-05-15 09:32</td></tr>
          </tbody>
        </table>
      `,
      rule: `
        <div class="formula-box">良品储位库存只统计正常良品货位库存；次品货位库存不展示、不计入良品储位库存。</div>
      `,
    }),
  },
  defect: {
    title: "次品库存详情",
    subtitle: "查看次品货位的库存明细",
    tabs: [
      { key: "detail", label: "次品货位" },
    ],
    render: (sku) => ({
      detail: `
        <h3 class="section-title">${sku} · 次品货位库存</h3>
        <table class="inner-table">
          <thead><tr><th>货位编码</th><th>总库存</th><th>可用库存</th><th>占用库存</th><th>最后变动时间</th></tr></thead>
          <tbody>
            <tr><td>4D20-A0111 <span class="defect-badge">次</span></td><td>2</td><td>2</td><td>0</td><td>2026-05-15 09:18</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  doc: {
    title: "单据详情",
    subtitle: "关联单据查看",
    tabs: [
      { key: "basic", label: "基础信息" },
      { key: "items", label: "商品与货位" },
      { key: "log", label: "操作记录" },
    ],
    render: (docNo) => ({
      basic: `
        <h3 class="section-title">${docNo}</h3>
        <dl class="desc-grid">
          <dt>单据号</dt><dd>${docNo}</dd>
          <dt>单据状态</dt><dd><span class="tag tag--processing">处理中</span></dd>
          <dt>仓库</dt><dd>SZ01 东莞仓</dd>
          <dt>客户编码</dt><dd>YYHC00001</dd>
          <dt>创建时间</dt><dd>2026-05-15 09:08</dd>
          <dt>创建人</dt><dd>系统 / WMS</dd>
        </dl>
      `,
      items: `
        <table class="inner-table">
          <thead><tr><th>SKU</th><th>来源货位</th><th>移动货位</th><th>数量</th><th>处理状态</th></tr></thead>
          <tbody>
            <tr><td>GACD0006-002</td><td>4D10-B0308</td><td>MOVE-01</td><td>1</td><td><span class="tag tag--processing">待出库</span></td></tr>
            <tr><td>GYQM0047-001</td><td>4D10-B0308</td><td>MOVE-02</td><td>2</td><td><span class="tag tag--warning">待还货上架</span></td></tr>
          </tbody>
        </table>
      `,
      log: `
        <table class="inner-table">
          <thead><tr><th>操作人</th><th>操作类型</th><th>操作对象</th><th>操作详情</th><th>操作时间</th></tr></thead>
          <tbody>
            <tr><td>系统</td><td>生成任务</td><td>${docNo}</td><td>生成拣货占用</td><td>2026-05-15 09:08</td></tr>
            <tr><td>拣货员A</td><td>拣货下架</td><td>${docNo}</td><td>来源货位转入移动货位</td><td>2026-05-15 09:32</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  sku: {
    title: "商品详情",
    subtitle: "SPU、SKU、图片、库存与销售信息",
    tabs: [
      { key: "spu", label: "SPU信息" },
      { key: "sku", label: "SKU信息" },
      { key: "images", label: "商品图片" },
      { key: "stock", label: "库存信息" },
      { key: "sales", label: "销售信息" },
    ],
    render: (sku) => ({
      spu: `
        <h3 class="section-title">SPU信息</h3>
        <table class="info-table">
          <tbody>
            <tr><th>SPU</th><td>GXJB0037</td><th>节日属性</th><td>—</td></tr>
            <tr><th>季节属性</th><td>—</td><th>品牌</th><td>品牌类型:白牌</td></tr>
            <tr><th>运营方式</th><td>自运营</td><th>默认仓发货</th><td>SZ01东莞仓</td></tr>
            <tr><th>产品中文名称</th><td>【独立自封袋】24V 6A 150W 开关电源模块</td><th>产品英文名称</th><td>24V 6A 150W switching power supply module</td></tr>
            <tr><th>产品类目</th><td>工业电子电源与控制板&gt;电源模块&gt;开关电源</td><th>易仓类目</th><td>—</td></tr>
          </tbody>
        </table>
      `,
      sku: `
        <h3 class="section-title">SKU信息</h3>
        <table class="info-table">
          <tbody>
            <tr><th>SKU</th><td>${sku}</td><th>变体组合</th><td>24V</td></tr>
            <tr><th>标题</th><td>1套[1件] 24V 6A 150W 开关电源模块</td><th>自定义SKU</th><td>${sku}</td></tr>
            <tr><th>采购价</th><td>20.7 CNY</td><th>销售状态</th><td>在线产品</td></tr>
            <tr><th>包装</th><td>自封袋</td><th>净重</th><td>202</td></tr>
            <tr><th>产品尺寸</th><td>11.5 * 6.5 * 3.5</td><th>包裹尺寸</th><td>11.5 * 6.5 * 3.5</td></tr>
          </tbody>
        </table>
      `,
      images: `
        <h3 class="section-title">商品图片</h3>
        <div class="image-grid">
          <div class="image-card">主图</div>
          <div class="image-card">包装</div>
          <div class="image-card">配件</div>
        </div>
      `,
      stock: `
        <h3 class="section-title">库存信息</h3>
        <table class="inner-table">
          <thead><tr><th>仓库</th><th>总库存</th><th>在途</th><th>储位库存</th><th>占用库存</th><th>待上架库存</th><th>锁定</th><th>次品库存</th></tr></thead>
          <tbody>
            <tr><td>SZ01 东莞仓</td><td>13</td><td>0</td><td>11</td><td>3</td><td>2</td><td>0</td><td>2</td></tr>
          </tbody>
        </table>
      `,
      sales: `
        <h3 class="section-title">销售信息</h3>
        <table class="info-table">
          <tbody>
            <tr><th>销售状态</th><td>在线产品</td><th>专属销售</th><td>—</td></tr>
            <tr><th>产品认证</th><td>—</td><th>产品单位</th><td>套</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
  fieldHelp: {
    title: "字段说明",
    subtitle: "库存查询列表字段口径",
    tabs: [
      { key: "rules", label: "库存口径" },
    ],
    render: () => ({
      rules: `
        <table class="inner-table">
          <thead><tr><th>字段</th><th>页面口径</th></tr></thead>
          <tbody>
            <tr><td>储位库存</td><td>良品货位上可用于履约的库存，不展示次品货位库存。</td></tr>
            <tr><td>占用库存</td><td>包含单据流转到仓库预占用、仓库生成拣货任务还没拣货的，以及仓库拣货下来还没出库的库存数量。</td></tr>
            <tr><td>待上架库存</td><td>待上架库存 = 入库待上架 + 拣货后还货待上架，即已拣货但需还回货位的数据和正常入库后待上架的数据。</td></tr>
            <tr><td>锁定</td><td>暂不计算拣货缺货；拣货缺货仍归入占用库存，后续仅用于独立冻结等非缺货锁定场景。</td></tr>
            <tr><td>次品库存</td><td>仓库次品数量。</td></tr>
          </tbody>
        </table>
      `,
    }),
  },
};

function showToast(text) {
  const toast = document.querySelector("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function parseBatch(text) {
  return text
    .split(/[\n,，]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function openDrawer(type, payload) {
  const config = drawerData[type];
  if (!config) return;
  const rendered = config.render(payload || "—");
  const tabs = document.querySelector("#drawerTabs");
  const body = document.querySelector("#drawerBody");
  const title = document.querySelector("#drawerTitle");
  const subtitle = document.querySelector("#drawerSubtitle");
  const drawer = document.querySelector("#detailDrawer");
  const mask = document.querySelector(".drawer-mask");

  state.lastDrawerId = payload || config.title;
  title.textContent = config.title;
  subtitle.textContent = payload ? `${payload} · ${config.subtitle}` : config.subtitle;
  tabs.innerHTML = config.tabs
    .map((tab, index) => `<button class="drawer-tab ${index === 0 ? "active" : ""}" data-drawer-tab="${tab.key}">${tab.label}</button>`)
    .join("");
  body.innerHTML = rendered[config.tabs[0].key] || "";

  tabs.querySelectorAll("[data-drawer-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.querySelectorAll(".drawer-tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      body.innerHTML = rendered[tab.dataset.drawerTab] || "";
    });
  });

  drawer.classList.add("open");
  mask.classList.add("open");
}

function closeDrawer() {
  document.querySelector("#detailDrawer").classList.remove("open");
  document.querySelector(".drawer-mask").classList.remove("open");
}

function closeModal() {
  document.querySelector("#importModal")?.classList.remove("open");
  document.querySelector(".modal-mask")?.classList.remove("open");
}

function updateLocationSelection() {
  const checked = [...document.querySelectorAll('[data-row-check="location"]:checked')];
  const bar = document.querySelector("#locationBatchBar");
  document.querySelector('[data-bind="locationSelected"]').textContent = checked.length;
  bar.classList.toggle("show", checked.length > 0);
  document.querySelectorAll('[data-row-check="location"]').forEach((box) => {
    box.closest("tr").classList.toggle("selected", box.checked);
  });
}

function renderChips(items) {
  const chips = document.querySelector("#activeChips");
  chips.innerHTML = items.map((item) => `<span class="chip">${item}<button data-action="remove-chip">×</button></span>`).join("");
  chips.classList.toggle("show", items.length > 0);
}

document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  const selectEl = event.target.closest(".fake-select");

  if (!selectEl) {
    document.querySelectorAll(".fake-select.open").forEach((item) => item.classList.remove("open"));
  }

  if (selectEl && !event.target.closest(".select-menu button")) {
    selectEl.classList.toggle("open");
  }

  if (event.target.closest(".select-menu button")) {
    const option = event.target.closest(".select-menu button");
    const select = option.closest(".fake-select");
    select.querySelector("[data-select-label]").textContent = option.dataset.value;
    select.classList.remove("open");
  }

  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "toggle-batch-search") {
    document.querySelector("#batchPopover").classList.toggle("open");
  }
  if (action === "cancel-batch") {
    document.querySelector("#batchPopover").classList.remove("open");
  }
  if (action === "apply-batch") {
    const items = parseBatch(document.querySelector("#batchTextarea").value);
    renderChips(items.slice(0, 6));
    document.querySelector("#keywordInput").value = items.join("，");
    document.querySelector("#batchPopover").classList.remove("open");
    showToast(`已应用 ${items.length} 个搜索条件`);
  }
  if (action === "search") {
    const keyword = document.querySelector("#keywordInput").value.trim();
    const location = document.querySelector("#locationCode").value.trim();
    renderChips([keyword && `搜索：${keyword}`, location && `货位：${location}`].filter(Boolean));
    showToast("查询条件已生效");
  }
  if (action === "reset") {
    document.querySelectorAll(".filter-panel input").forEach((input) => {
      input.value = "";
    });
    renderChips([]);
    showToast("筛选条件已重置");
  }
  if (action === "remove-chip") {
    actionEl.closest(".chip").remove();
    const chips = document.querySelector("#activeChips");
    chips.classList.toggle("show", chips.children.length > 0);
  }
  if (action === "open-occupied") {
    openDrawer("occupied", actionEl.dataset.sku);
  }
  if (action === "open-pending") {
    openDrawer("pending", actionEl.dataset.sku);
  }
  if (action === "open-locked") {
    openDrawer("locked", actionEl.dataset.sku);
  }
  if (action === "open-defect") {
    openDrawer("defect", actionEl.dataset.sku);
  }
  if (action === "open-location-detail") {
    openDrawer("location", actionEl.dataset.sku);
  }
  if (action === "open-good-location-detail") {
    openDrawer("goodLocation", actionEl.dataset.sku);
  }
  if (action === "open-doc") {
    openDrawer("doc", actionEl.dataset.doc);
  }
  if (action === "open-sku") {
    openDrawer("sku", actionEl.dataset.sku);
  }
  if (action === "close-drawer") {
    closeDrawer();
  }
  if (action === "close-modal") {
    closeModal();
  }
  if (action === "mock-upload") {
    closeModal();
    showToast("导入任务已提交，可在任务中心查看结果");
  }
  if (action === "export-current" || action === "export-selected" || action === "export-mobile") {
    showToast("导出任务已创建");
  }
  if (action === "clear-selection") {
    document.querySelectorAll('[data-row-check="location"], [data-action="select-all-location"]').forEach((box) => {
      box.checked = false;
    });
    updateLocationSelection();
  }
  if (action === "open-field-help") {
    openDrawer("fieldHelp", "字段口径");
  }
  if (action === "toggle-columns") {
    showToast("列设置面板已打开");
  }
  if (action === "copy-drawer-id") {
    showToast(`已复制：${state.lastDrawerId}`);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches('[data-row-check="location"]')) {
    updateLocationSelection();
  }

  if (event.target.matches('[data-action="select-all-location"]')) {
    const checked = event.target.checked;
    document.querySelectorAll('[data-row-check="location"]').forEach((box) => {
      box.checked = checked;
    });
    updateLocationSelection();
  }
});

document.querySelectorAll("[data-tab-target]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-tab-target]").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll("[data-tab-pane]").forEach((pane) => pane.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-tab-pane="${tab.dataset.tabTarget}"]`).classList.add("active");
  });
});

document.querySelector("#batchTextarea").addEventListener("input", (event) => {
  document.querySelector("#batchCount").textContent = `已识别 ${parseBatch(event.target.value).length} 个条件`;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeModal();
    document.querySelector("#batchPopover").classList.remove("open");
  }
});

document.querySelectorAll("[data-tip]").forEach((node) => {
  const tooltip = document.querySelector("#tooltip");
  node.addEventListener("mouseenter", () => {
    tooltip.textContent = node.dataset.tip;
    const rect = node.getBoundingClientRect();
    tooltip.style.left = `${Math.min(rect.left, window.innerWidth - 300)}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
    tooltip.style.display = "block";
  });
  node.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});
