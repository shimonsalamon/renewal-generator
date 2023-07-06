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
  const preferentialRent = Number(document.getElementById("lowerRent").value);
  const securityDeposit = Number(
    document.getElementById("securityDeposit").value
  );

  const airConditionerFee = Number(
    document.getElementById("airConditioner").value
  );
  const four21AFee = Number(document.getElementById("four21ACharge").value);
  const appliancesFee = Number(document.getElementById("appliances").value);
  const otherChargeName = document.getElementById("otherChargeName").value;
  const otherChargeAmount = Number(
    document.getElementById("otherChargeAmount").value
  );

  const scrieDrieRent = Number(document.getElementById("scrieDrieRent").value);
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

  const currentDepositPDF = form.getTextField("Current Deposit");
  const oneYearAdditionalDepositPDF = form.getTextField(
    "Additional Deposit Required  1 year lease"
  );
  const twoYearAdditionalDepositYear1PDF = form.getTextField(
    "Additional Deposit Required  2 year lease"
  );
  const twoYearAdditionalDepositYear2PDF = form.getTextField("undefined_13");

  const airConditionerFeePDF = form.getTextField("a  Air conditioner");
  const four21AFeePDF = form.getTextField("undefined_14");
  const appliancesFeePDF = form.getTextField("undefined_15");
  const otherChargeNamePDF = form.getTextField("Other");
  const otherChargeAmountPDF = form.getTextField("undefined_16");
  const totalSeparateChargesPDF = form.getTextField("Total separate charges");

  const oneYearPreferentialRentPDF = form.getTextField(
    "5 Different Rent to be charged if any  1 year lease"
  );
  const twoYearPreferentialRentYear1PDF = form.getTextField("2 year lease");
  const twoYearPreferentialRentYear2PDF = form.getTextField("undefined_17");
  const preferentialRiderCheckboxPDF = form.getCheckBox("Check Box1");
  const noPreferentialRiderCheckboxPDF = form.getCheckBox("Check Box2");

  const oneYearRentPDF = form.getTextField(
    "6 Tenant shall pay a monthly rent enter amount from 2F or 5 of"
  );
  const twoYearRentYear1PDF = form.getTextField("for a 1 year renewal or");
  const twoYearRentYear2PDF = form.getTextField("undefined_18");
  const totalSeparateChargesPDF_2 = form.getTextField(
    "for a 2 year renewal plus total separate charges enter amount from 4"
  );
  const totalRentFor1YearLeasePDF = form.getTextField("undefined_19");
  const totalRentFor2YearLeaseYear1PDF = form.getTextField(
    "for a 1 year renewal  or"
  );
  const totalRentFor2YearLeaseYear2PDF = form.getTextField("undefined_20");

  // 7 This renewal lease shall commence on (renewal start)
  // date of mailing or personal delivery of this Renewal Lease Form This Renewal Lease shall terminate on (renewal end 1year)
  // lease or (renewal end 2year)

  const scrieDrieRentPDF = form.getTextField("the amount of");

  const sprinklerSystemCheckboxPDF = form.getCheckBox("Check Box4");
  const noSprinklerSystemCheckboxPDF = form.getCheckBox("Check Box3");
  const sprinklerDatePDF = form.getTextField("on");

  const oneYearRentPDF_2 = form.getTextField("plus");
  const totalSeparateChargesPDF_3 = form.getTextField("separate charges of");
  const totalRentFor1YearLeasePDF_2 = form.getTextField(
    "for a total monthly payment of"
  );
  const twoYearRentYear1PDF_2 = form.getTextField("See above explanation");
  const twoYearRentYear2PDF_2 = form.getTextField("undefined_22");
  const totalSeparateChargesPDF_4 = form.getTextField(
    "plus separate charges of"
  );
  const totalRentFor2YearLeaseYear1PDF_2 = form.getTextField(
    "for a total monthly payment of_2"
  );
  const totalRentFor2YearLeaseYear2PDF_2 = form.getTextField("undefined_21");

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
  oneYearIncreasePercentPDF.setText(
    formatNumber(oneYearIncreasePercent * 100, 0)
  );
  oneYearIncreaseAmountPDF.setText(formatNumber(oneYearIncreaseAmount));
  twoYearIncreasePercentYear1PDF.setText(
    formatNumber(twoYearIncreasePercentYear1 * 100, 0)
  );
  twoYearIncreasePercentYear2PDF.setText(
    formatNumber(twoYearIncreasePercentYear2 * 100, 0)
  );
  twoYearIncreaseAmountYear1PDF.setText(
    formatNumber(twoYearIncreaseAmountYear1)
  );
  twoYearIncreaseAmountYear2PDF.setText(
    formatNumber(twoYearIncreaseAmountYear2)
  );

  preferentialRentCheckbox
    ? preferentialRentCheckboxPDF.check()
    : preferentialRentCheckboxPDF.uncheck();

  oneYearAmountTotalPDF.setText(formatNumber(oneYearAmountTotal));
  twoYearAmountTotalYear1PDF.setText(formatNumber(twoYearAmountTotalYear1));
  twoYearAmountTotalYear2PDF.setText(formatNumber(twoYearAmountTotalYear2));

  currentDepositPDF.setText(formatNumber(securityDeposit));
  oneYearAdditionalDepositPDF.setText(
    formatNumber(oneYearAmountTotal - securityDeposit)
  );
  twoYearAdditionalDepositYear1PDF.setText(
    formatNumber(twoYearAmountTotalYear1 - securityDeposit)
  );
  twoYearAdditionalDepositYear2PDF.setText(
    formatNumber(twoYearAmountTotalYear2 - securityDeposit)
  );

  airConditionerFeePDF.setText(formatNumber(airConditionerFee));
  four21AFeePDF.setText(formatNumber(four21AFee));
  appliancesFeePDF.setText(formatNumber(appliancesFee));
  otherChargeNamePDF.setText(otherChargeName || "N/A");
  otherChargeAmountPDF.setText(formatNumber(otherChargeAmount));
  const totalSeparateCharges =
    airConditionerFee + four21AFee + appliancesFee + otherChargeAmount;
  totalSeparateChargesPDF.setText(formatNumber(totalSeparateCharges));

  if (preferentialRentCheckbox) {
    const oneYearPreferentialRent =
      preferentialRent * oneYearIncreasePercent + preferentialRent;
    const twoYearPreferentialRentYear1 =
      preferentialRent * twoYearIncreasePercentYear1 + preferentialRent;
    const twoYearPreferentialRentYear2 =
      twoYearPreferentialRentYear1 * twoYearIncreasePercentYear2 +
      twoYearPreferentialRentYear1;
    oneYearPreferentialRentPDF.setText(formatNumber(oneYearPreferentialRent));
    twoYearPreferentialRentYear1PDF.setText(
      formatNumber(twoYearPreferentialRentYear1)
    );
    twoYearPreferentialRentYear2PDF.setText(
      formatNumber(twoYearPreferentialRentYear2)
    );
    // preferentialRiderCheckboxPDF.check();
    // noPreferentialRiderCheckboxPDF.uncheck();

    oneYearRentPDF.setText(formatNumber(oneYearPreferentialRent));
    oneYearRentPDF_2.setText(formatNumber(oneYearPreferentialRent));
    twoYearRentYear1PDF.setText(formatNumber(twoYearPreferentialRentYear1));
    twoYearRentYear1PDF_2.setText(formatNumber(twoYearPreferentialRentYear1));
    twoYearRentYear2PDF.setText(formatNumber(twoYearPreferentialRentYear2));
    twoYearRentYear2PDF_2.setText(formatNumber(twoYearPreferentialRentYear2));
    totalRentFor1YearLeasePDF.setText(
      formatNumber(oneYearPreferentialRent + totalSeparateCharges)
    );
    totalRentFor1YearLeasePDF_2.setText(
      formatNumber(oneYearPreferentialRent + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear1PDF.setText(
      formatNumber(twoYearPreferentialRentYear1 + totalSeparateCharges)
    );

    totalRentFor2YearLeaseYear1PDF_2.setText(
      formatNumber(twoYearPreferentialRentYear1 + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear2PDF.setText(
      formatNumber(twoYearPreferentialRentYear2 + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear2PDF_2.setText(
      formatNumber(twoYearPreferentialRentYear2 + totalSeparateCharges)
    );
  } else {
    // oneYearPreferentialRentPDF.setText(formatNumber(oneYearAmountTotal));
    // twoYearPreferentialRentYear1PDF.setText(formatNumber(twoYearAmountTotalYear1));
    // twoYearPreferentialRentYear2PDF.setText(formatNumber(twoYearAmountTotalYear2));
    oneYearPreferentialRentPDF.setText("N/A");
    twoYearPreferentialRentYear1PDF.setText("N/A");
    twoYearPreferentialRentYear2PDF.setText("N/A");
    preferentialRiderCheckboxPDF.uncheck();
    noPreferentialRiderCheckboxPDF.check();

    oneYearRentPDF.setText(formatNumber(oneYearAmountTotal));
    oneYearRentPDF_2.setText(formatNumber(oneYearAmountTotal));
    twoYearRentYear1PDF.setText(formatNumber(twoYearAmountTotalYear1));
    twoYearRentYear1PDF_2.setText(formatNumber(twoYearAmountTotalYear1));
    twoYearRentYear2PDF.setText(formatNumber(twoYearAmountTotalYear2));
    twoYearRentYear2PDF_2.setText(formatNumber(twoYearAmountTotalYear2));
    totalRentFor1YearLeasePDF.setText(
      formatNumber(oneYearAmountTotal + totalSeparateCharges)
    );
    totalRentFor1YearLeasePDF_2.setText(
      formatNumber(oneYearAmountTotal + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear1PDF.setText(
      formatNumber(twoYearAmountTotalYear1 + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear1PDF_2.setText(
      formatNumber(twoYearAmountTotalYear1 + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear2PDF.setText(
      formatNumber(twoYearAmountTotalYear2 + totalSeparateCharges)
    );
    totalRentFor2YearLeaseYear2PDF_2.setText(
      formatNumber(twoYearAmountTotalYear2 + totalSeparateCharges)
    );
  }
  totalSeparateChargesPDF_2.setText(formatNumber(totalSeparateCharges));
  totalSeparateChargesPDF_3.setText(formatNumber(totalSeparateCharges));
  totalSeparateChargesPDF_4.setText(formatNumber(totalSeparateCharges));

  scrieDrieRentPDF.setText(scrieDrieRent ? formatNumber(scrieDrieRent) : "N/A");

  if (sprinklerSystemCheckbox) {
    sprinklerSystemCheckboxPDF.check();
    noSprinklerSystemCheckboxPDF.uncheck();
    sprinklerDatePDF.setText(lastInspected);
  } else {
    sprinklerSystemCheckboxPDF.uncheck();
    noSprinklerSystemCheckboxPDF.check();
    sprinklerDatePDF.setText("N/A");
  }

  form.flatten();

  const pdfBytes = await pdfDoc.save();

  // update the UI with the new PDF
  document.getElementById("pdf").src = URL.createObjectURL(
    new Blob([pdfBytes], {
      type: "application/pdf",
      name: "rtp-8-06-2023-fillable.pdf",
    })
  );

  // download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");
}

function formatNumber(
  number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) {
  return number.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
