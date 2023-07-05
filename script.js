// Set today's date as the default value for the date field
var today = new Date();
var formattedDate = today.toISOString().split("T")[0];
document.getElementById("date").value = formattedDate;

// Get the checkbox and related fields
var preferentialRentCheckbox = document.getElementById("preferentialRent");
var sprinklerSystemCheckbox = document.getElementById("sprinklerSystem");

var lowerRentInput = document.getElementById("lowerRent");
var lastInspectedInput = document.getElementById("lastInspected");

// Disable the related fields initially
lowerRentInput.disabled = true;
lastInspectedInput.disabled = true;

// Add event listener to the checkbox
preferentialRentCheckbox.addEventListener("change", function () {
  // Enable/disable the related fields based on the checkbox state
  lowerRentInput.disabled = !preferentialRentCheckbox.checked;
});

// Add event listener to the checkbox
sprinklerSystemCheckbox.addEventListener("change", function () {
  // Enable/disable the related fields based on the checkbox state
  lastInspectedInput.disabled = !sprinklerSystemCheckbox.checked;
});

const { PDFDocument, rgb } = PDFLib;

async function fillForm() {
  // Get the form fields from rhe html document
  const date = new Date(document.getElementById("date").value);

  const tenantName1 = document.getElementById("tenantName1").value;
  const tenantName2 = document.getElementById("tenantName2").value;
  const tenantAddress1 = document.getElementById("tenantAddress1").value;
  const tenantAddress2 = document.getElementById("tenantAddress2").value;

  const ownerName = document.getElementById("ownerName").value;
  const ownerAddress1 = document.getElementById("ownerAddress1").value;
  const ownerAddress2 = document.getElementById("ownerAddress2").value;

  const leaseExpirationDate = document.getElementById("leaseExpirationDate");
  const currentRent = Number(document.getElementById("currentRent").value);
  const preferentialRentCheckbox =
    document.getElementById("preferentialRent").checked;
  const preferentialRent = document.getElementById("lowerRent").value;
  const securityDeposit = document.getElementById("securityDeposit").value;

  const airConditionerFee = document.getElementById("airConditioner").value;
  const four21AFee = document.getElementById("four21ACharge").value;
  const appliancesFee = document.getElementById("appliances").value;
  const otherChargeName = document.getElementById("otherChargeName").value;
  const otherChargeAmount = document.getElementById("otherChargeAmount").value;

  const scrieDrieRent = document.getElementById("scrieDrieRent").value;
  const sprinklerSystemCheckbox =
    document.getElementById("sprinklerSystem").checked;
  const lastInspected = document.getElementById("lastInspected").value;

  // Calculate 1 year increase 3% of current rent
  const oneYearIncreasePercent = 0.03;
  const oneYearIncreaseAmount = currentRent * oneYearIncreasePercent;
  const oneYearAmountTotal = currentRent + oneYearIncreaseAmount;

  // Calculate 2 year for year 1 2.75% of current rent
  const twoYearIncreasePercentYear1 = 0.0275;
  const twoYearIncreaseAmountYear1 = currentRent * twoYearIncreasePercentYear1;
  const twoYearAmountTotalYear1 = currentRent + twoYearIncreaseAmountYear1;

  // Calculate 2 year for year 2 3.20% on top of year 1 total
  const twoYearIncreasePercentYear2 = 0.032;
  const twoYearIncreaseAmountYear2 =
    twoYearAmountTotalYear1 * twoYearIncreasePercentYear2;
  const twoYearAmountTotalYear2 =
    twoYearAmountTotalYear1 + twoYearIncreaseAmountYear2;

  const formPdfBytes = await fetch("rtp-8-06-2023-fillable.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  const datePDF = form.getTextField("Dated");
  const dateYearPDF = form.getTextField("20");

  const tenantName1PDF = form.getTextField("Tenants Names and Address 1");
  const tenantName2PDF = form.getTextField("Tenants Names and Address 2");
  const tenantName3PDF = form.getTextField("Tenants Names and Address 3");
  const tenantName4PDF = form.getTextField("Tenants Names and Address 4");

  const ownerName2PDF = form.getTextField("Owners Agents Name and Address 2");
  const ownerName3PDF = form.getTextField("Owners Agents Name and Address 3");
  const ownerName4PDF = form.getTextField("Owners Agents Name and Address 4");

  const expirationDatePDF = form.getTextField("Text12");

  const currentRentPDF = form.getTextField("undefined_2");

  const oneYearIncreasePercentPDF = form.getTextField("Text2");
  const oneYearIncreaseAmountPDF = form.getTextField("undefined_3");
  const twoYearIncreasePercentYear1PDF = form.getTextField("Text3");
  const twoYearIncreasePercentYear2PDF = form.getTextField("Text4");
  const twoYearIncreaseAmountYear1PDF = form.getTextField("undefined_7");
  const twoYearIncreaseAmountYear2PDF = form.getTextField("undefined_8");

  const preferentialRentCheckboxPDF = form.getCheckBox("Check Box14");

  const oneYearAmountTotalPDF = form.getTextField("undefined_6");
  const twoYearAmountTotalYear1PDF = form.getTextField("undefined_11");
  const twoYearAmountTotalYear2PDF = form.getTextField("undefined_12");

  date.setUTCHours(0, 0, 0, 0);
  date.setUTCHours(date.getUTCHours() + +4);

  const formattedDate1 = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  const formattedDate2 = date.toLocaleDateString("en-US", { year: "2-digit" });
  datePDF.setText(formattedDate1);
  dateYearPDF.setText(formattedDate2);

  tenantName1PDF.setText(tenantName1);
  tenantName2PDF.setText(tenantName2);
  tenantName3PDF.setText(tenantAddress1);
  tenantName4PDF.setText(tenantAddress2);

  ownerName2PDF.setText(ownerName);
  ownerName3PDF.setText(ownerAddress1);
  ownerName4PDF.setText(ownerAddress2);

  expirationDatePDF.setText(leaseExpirationDate.value);

  currentRentPDF.setText(formatNumber(currentRent));
  oneYearIncreasePercentPDF.setText(formatNumber(oneYearIncreasePercent * 100));
  oneYearIncreaseAmountPDF.setText(formatNumber(oneYearIncreaseAmount));
  twoYearIncreasePercentYear1PDF.setText(
    formatNumber(twoYearIncreasePercentYear1 * 100)
  );
  twoYearIncreasePercentYear2PDF.setText(
    formatNumber(twoYearIncreasePercentYear2 * 100)
  );
  twoYearIncreaseAmountYear1PDF.setText(
    formatNumber(twoYearIncreaseAmountYear1)
  );
  twoYearIncreaseAmountYear2PDF.setText(
    formatNumber(twoYearIncreaseAmountYear2)
  );

  preferentialRentCheckbox ? preferentialRentCheckboxPDF.check() : preferentialRentCheckboxPDF.uncheck();

  oneYearAmountTotalPDF.setText(formatNumber(oneYearAmountTotal));
  twoYearAmountTotalYear1PDF.setText(formatNumber(twoYearAmountTotalYear1));
  twoYearAmountTotalYear2PDF.setText(formatNumber(twoYearAmountTotalYear2));

  form.flatten();

  const pdfBytes = await pdfDoc.save();

  // update the UI with the new PDF 
  document.getElementById("pdf").src = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf", name: "rtp-8-06-2023-fillable.pdf" })
  );

  // download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");
}

function formatNumber(number) {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Dated
// 20 (year ex: 23)

// Tenants Names and Address 1
// Tenants Names and Address 2
// Tenants Names and Address 3
// Tenants Names and Address 4

// Owners Agents Name and Address 1
// Owners Agents Name and Address 2
// Owners Agents Name and Address 3
// Owners Agents Name and Address 3

// Text12 (expiration date is that field)

// undefined_2 (current legal rent amount)

// Text2  (1Year increase %)
// undefined_3 (1Year increase amount)
// Text3 (2Year increase % year 1)
// Text4 (2Year increase % year 2)
// undefined_7 (2Year increase amount year 1)
// undefined_8 (2Year increase amount year 2)

// Check Box14 (is there a prefrntail rent?)

// undefined_6 (1Year total new rent)
// undefined_11 (2Year total new rent year 1)
// undefined_12 (2Year total new rent year 2)

// Current Deposit
// Additional Deposit Required  1 year lease
// Additional Deposit Required  2 year lease (year 1)
// undefined_13 (2Year additional deposit year 2)

// a  Air conditioner
// undefined_14 (421a 2.2%)
// undefined_15 (appliances fee)
// Other (other seprae charge - enter type)
// undefined_16 (other seprae charge - enter amount)
// Total separate charges

// 5 Different Rent to be charged if any  1 year lease
// 2 year lease
// undefined_17 (lower rent to be charged on 2 year lease year 2)
// Check Box1 (if you provide a prefrantial rider - checked if yes)
// Check Box2 (if you provide a prefrantial rider - checked if no)

// 6 Tenant shall pay a monthly rent enter amount from 2F or 5 of (monthly rent for 1 year lease)
// for a 1 year renewal or (monthly rent for 2 year lease year 1)
// undefined_18 (monthly rent for 2 year lease year 2)
// for a 2 year renewal plus total separate charges enter amount from 4 (total separate charges)
// undefined_19 (total rent to be paid for a 1 year lease)
// for a 1 year renewal  or (total rent to be paid for a 2 year lease - Year 1)
// undefined_20 (total rent to be paid for a 2 year lease - Year 2)

// 7 This renewal lease shall commence on (renewal start)
// date of mailing or personal delivery of this Renewal Lease Form This Renewal Lease shall terminate on (renewal end 1year)
// lease or (renewal end 2year)

// the amount of (SCRIE or DRIE amount tenant will actully pays)

// Check Box4 (checked if have a splrinkler)
// Check Box4 (checked if not have a splrinkler)
// on (last sprinkler inspection date)

// plus (monthly rent for 1 year lease)
// separate charges of (total separate charges)
// for a total monthly payment of (total rent to be paid for a 1 year lease)
// See above explanation (monthly rent for 2 year lease year 1)
// undefined_22 (monthly rent for 2 year lease year 2)
// plus separate charges of (total separate charges)
// for a total monthly payment of_2 (total rent to be paid for a 2 year lease - Year 1)
// undefined_21 (total rent to be paid for a 2 year lease - Year 2)
