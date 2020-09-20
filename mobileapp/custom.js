const services = [
  {
    title: "ACCOUNTING SERVICES",
    desc:
      "Businesses rely on well-organized and accurate financial records in order to maintain profitability and ensure that operations will run more efficiently on a daily basis. Our Group helps your business get closer to these goals with accurate record keeping and support on financial issues by offering these services.",
    subservices: [
      {
        title: "Operational Reporting",
        subservice: [
          "Book keeping",
          "HR Payroll",
          "Bank Reconciliation",
          "Accounts Payable",
          "Accounts Receivable",
          "Cash Flow Management",
          "Fund Flow",
          "Inventory Management",
          "Payment Gateway Reconciliation",
          "Bank Reconciliation",
          "Inventory Reconciliation",
        ],
      },
      {
        title: "Management Reporting",
        subservice: [
          "Ongoing Financial Reporting",
          "Month End Closure",
          "Board & Management Reporting",
          "Indian GAAP / US GAAP/ IFRS Reporting",
          "Financial Analysis, Planning & Reporting",
          "Budgeting, Forecasting Analysis",
        ],
      },
    ],
  },
  {
    title: "TAXATION",
    desc:
      "Tax planning is an essential element of the tax preparation process. Our experienced Group will alert you to new developments in the tax laws that will help you to minimize both your current and future tax liabilities.",
    subservices: [
      {
        title: "Taxation Services",
        subservice: [
          "Tax consulting",
          "Tax planning",
          "Tax preparation",
          "Calculation & Payment of taxes (GST, PT, TDS, PF etc.)",
          "Periodic Compliance Management",
          "Tax Due Diligence",
          "International Taxation",
          "Transfer Pricing",
          "Arbitration",
          "Monthly GST Filling , Audits & Reconciliation",
          "FEMA & RBI Consultancy",
          "Litigation"
        ],
      },
      
    ],
  },
  {
    title: "TRANSACTION SUPPORT",
    desc:
      "Whether you are considering the launch of a new product, expanding operations, evaluating an exit strategy or acquiring another business to help achieve your growth objectives, CFO Planet is the source for expert assistance in preparing for the transaction or evaluating your options. The broad industry experience and operational strength of our strategic planning consultants sets us apart from other financial consulting firms. CFO Planet’s team will provide insights and guidance instrumental to your organization so that you have the support you need to successfully navigate a transition.",
    subservices: [
      {
        title: "Transaction Support Services",
        subservice: [
          "Due Diligence",
          "Business Valuation",
          "Merger & Acquisition",
          "MIS Reporting",
          "Loan Syndication",
          "Equity Syndication",
          "Business Plan & Strategies",
          "IFRS Transition",
          "IPO Support",
        ],
      },
      
    ],
  },
  {
    title: "VIRTUAL CFO SERVICES",
    desc:
      "An entrepreneur managing a growing business, needs a strategic partner to lead & manage the financial aspects of the business. CFO PLANET provides you with all the services of a CFO, except, the CFO won’t be a full time employee. Our CFO may not be present on-site all the time but will always be there when you need him/her. Depending on the size and the growth stage of your company, we provide a flexible engagement model, enabling you to increase/decrease engagement levels, thereby giving you the opportunity of having the best CFO talent assisting you, based on your needs. Our ongoing Virtual CFO retainer engagements can be as low as 2 hours a week and can go as high as 35 hours a week. This flexible engagement model will help you keep your CFO costs variable and low but the experience will always remain enriching and memorable.",
    subservices: [
      {
        title: "Services",
        subservice: [
          "Assist in formulating the company’s future direction and supporting tactical initiatives",
          "Monitor and direct the implementation of strategic business plans",
          "Develop financial and tax strategies",
          "Manage the capital request and budgeting processes",
          "Develop performance measures that support the company’s strategic direction",
          "Development of Promoter’s Vision/ Mission Statement",
          "Monitor cash balances and cash forecasts",
          "Arrange for debt and equity financing",
          "PE/VC/IPO Management",
          "Automation by adopting various IT Tools",
          "MIS Dashboard Development",
          "Manage the accounting, human resources, investor relations, legal, tax, and treasury departments",
          "PE/VC/IPO Management",
          "Treasury Management",
        ],
      },
      
    ],
  },
  {
    title: "LEGAL SERVICES",
    desc:
    "CFO Planet offers “One Stop” legal solutions to its clients that included litigation management, contractor management, vendor management, documentation etc. CFO Planet has a professional corporate structure to support its functioning. Each practice area is managed by a team of highly qualified and experienced lawyers and duly supported by other corporate/technical experts with extensive knowledge, experience and capabilities in their respective areas, to ensure invaluable advice, timely delivery and cost effective legal services.",
    subservices: [
      {
        title: "Services",
        subservice: [
          "NDA",
          "MOU",
          "Vendor/Third Party Agreements",
          "Terms & Condition",
          "Privacy, Offer, Cancellation, Return & Refund Policy",
          "Seller Agreements",
          "Term Sheets",
          "Shareholders Agreement",
          "Service Agreement",
          "ESOP",
          "Founders Agreement",
          "Employee Agreements",
          "Legal Notice",
        ],
      },
      
    ],
  },
  {
    title: "COMPANY SECRETARY",
    desc:
    "CFO Planet team provided an end to end solution for secretarial compliances as per the provisions of Companies Act and rules made there under and other laws applicable to the company to ensure that the company complies with the applicable secretarial standards and to discharge such other duties as may be required under Companies Act.",
    subservices: [
      {
        title: "Services",
        subservice: [
          "Incorporation",
          "Trademark",
          "Maintenance of statutory registers",
          "Drafting of board minutes & general meetings",
          "ROC Compliances",
          "Compliance related to investments",
          "Company Secretarial Audit",
          "FEMA & RBI Compliances",
          "Closure Of Company or Liquidation",
         
        ],
      },
      
    ],
  },
];
$(document).ready(() => {
  let html = "";
  let header = "";
  const servicename = getParameterByName("servicename");
  console.log(servicename);
  services.forEach((service) => {
    if (servicename === service.title) {
      header = service.title;
      html += `<ul class="collection with-header">`;
      html += `<li class="collection-item collection-desc">`;
      html += `<div class="list-content">`;
      html += `<div class="list-title-area">`;
      html += `<div class="list-title"><h5>${service.title}</h5></div></div>`;
      html += `<div class="list-desc">${service.desc}</div></div></li>`;
      service.subservices.forEach((data) => {
        html += ` <li class="collection-header"><h6>${data.title}</h6></li>`;
        data.subservice.forEach((subservice) => {
          html += `<li class="collection-item"><div>${subservice}<span class="secondary-content"><i class="material-icons">keyboard_arrow_right</i></span></div></li>`;
        });
      });
      html += `</ul>`;
    }
  });

  $("#listing").html(html);
  $("#headertitle").html(header);
});
$(document).on('click','.back-arrow',function (){
window.location.href = 'home.html'
});
