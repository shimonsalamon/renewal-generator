// Set today's date as the default value for the date field
const today = new Date();
const formattedDate = today.toLocaleDateString("en-CA");
document.getElementById("date").value = formattedDate;

// Get the checkbox and related fields
const preferentialRentCheckbox = document.getElementById("preferentialRent");
const sprinklerSystemCheckbox = document.getElementById("sprinklerSystem");

const lowerRentInput = document.getElementById("lowerRent");
const lowerRentCheckbox = document.getElementById("preferentialRider");
const lastInspectedInput = document.getElementById("lastInspected");

// Disable the related fields initially
disableField(lowerRentInput);
disableField(lowerRentCheckbox);
disableField(lastInspectedInput);

// Add event listener to the checkbox
preferentialRentCheckbox.addEventListener("change", function () {
  toggleFieldState(preferentialRentCheckbox.checked, lowerRentInput);
  toggleFieldState(preferentialRentCheckbox.checked, lowerRentCheckbox);
});

// Add event listener to the checkbox
sprinklerSystemCheckbox.addEventListener("change", function () {
  toggleFieldState(sprinklerSystemCheckbox.checked, lastInspectedInput);
});

const { PDFDocument, rgb } = PDFLib;

async function fillForm() {
  // Get the form fields from the HTML document
  const date = parseLocalDate(getFieldValue("date"));
  const tenantName1 = getFieldValue("tenantName1");
  const tenantName2 = getFieldValue("tenantName2");
  const tenantAddress1 = getFieldValue("tenantAddress1");
  const tenantAddress2 = getFieldValue("tenantAddress2");
  const ownerName = getFieldValue("ownerName");
  const ownerAddress1 = getFieldValue("ownerAddress1");
  const ownerAddress2 = getFieldValue("ownerAddress2");
  const leaseExpirationDate = parseLocalDate(
    getFieldValue("leaseExpirationDate")
  );
  const currentRent = Number(getFieldValue("currentRent"));
  const preferentialRent = preferentialRentCheckbox.checked
    ? Number(getFieldValue("lowerRent"))
    : null;
  const securityDeposit = Number(getFieldValue("securityDeposit"));
  const depositType = getRadioGroupValue("depositType");
  const airConditionerFee = Number(getFieldValue("airConditioner"));
  const four21AFee = Number(getFieldValue("four21ACharge"));
  const appliancesFee = Number(getFieldValue("appliances"));
  const otherChargeName = getFieldValue("otherChargeName");
  const otherChargeAmount = Number(getFieldValue("otherChargeAmount"));
  const totalSeparateCharges = airConditionerFee + four21AFee + appliancesFee + otherChargeAmount;
  const scrieDrieRent = Number(getFieldValue("scrieDrieRent"));
  const lastInspected = sprinklerSystemCheckbox.checked
    ? parseLocalDate(getFieldValue("lastInspected"))
    : null;

  // Calculate rent increases
  const oneYearIncreasePercent = 0.03;
  const oneYearIncreaseAmount = currentRent * oneYearIncreasePercent;
  const oneYearAmountTotal = currentRent + oneYearIncreaseAmount;

  const twoYearIncreasePercentYear1 = 0.0275;
  const twoYearIncreaseAmountYear1 = currentRent * twoYearIncreasePercentYear1;
  const twoYearAmountTotalYear1 = currentRent + twoYearIncreaseAmountYear1;

  const twoYearIncreasePercentYear2 = 0.032;
  const twoYearIncreaseAmountYear2 =
    twoYearAmountTotalYear1 * twoYearIncreasePercentYear2;
  const twoYearAmountTotalYear2 =
    twoYearAmountTotalYear1 + twoYearIncreaseAmountYear2;

  // Calculate preferential rent increases
  const oneYearPreferentialAmountTotal = preferentialRent + (preferentialRent * oneYearIncreasePercent);
  const twoYearPreferentialAmountTotalYear1 = preferentialRent + (preferentialRent * twoYearIncreasePercentYear1);
  const twoYearPreferentialAmountTotalYear2 = twoYearPreferentialAmountTotalYear1 + (twoYearPreferentialAmountTotalYear1 * twoYearIncreasePercentYear2);

  // Calculate total rent
  const oneYearRent = preferentialRentCheckbox.checked ? oneYearPreferentialAmountTotal : oneYearAmountTotal;
  const twoYearRentYear1 = preferentialRentCheckbox.checked ? twoYearPreferentialAmountTotalYear1 : twoYearAmountTotalYear1;
  const twoYearRentYear2 = preferentialRentCheckbox.checked ? twoYearPreferentialAmountTotalYear2 : twoYearAmountTotalYear2;

  // Calculate additional security deposit
  const additionalSecurityDeposit = {
    preferential: {
      oneYear: oneYearRent - securityDeposit,
      twoYearYear1: twoYearRentYear1 - securityDeposit,
      twoYearYear2: twoYearRentYear2 - securityDeposit - (twoYearRentYear1 - securityDeposit)
    },
    legal: {
      oneYear: oneYearAmountTotal - securityDeposit,
      twoYearYear1: twoYearAmountTotalYear1 - securityDeposit,
      twoYearYear2: twoYearAmountTotalYear2 - securityDeposit - (twoYearAmountTotalYear1 - securityDeposit)
    },
    percentage: {
      oneYear: securityDeposit * oneYearIncreasePercent,
      twoYearYear1: securityDeposit * twoYearIncreasePercentYear1,
      twoYearYear2: (securityDeposit + (securityDeposit * twoYearIncreasePercentYear1)) * twoYearIncreasePercentYear2
    }
  };
  
  const oneYearAdditionalSecurityDeposit = additionalSecurityDeposit[depositType].oneYear;
  const twoYearAdditionalSecurityDepositYear1 = additionalSecurityDeposit[depositType].twoYearYear1;
  const twoYearAdditionalSecurityDepositYear2 = additionalSecurityDeposit[depositType].twoYearYear2;

  // Calculate renewal lease dates based on leaseExpirationDate
  const renewalStartDate = new Date(leaseExpirationDate);
  renewalStartDate.setDate(renewalStartDate.getDate() + 1);

  const renewalEndDate1Year = new Date(renewalStartDate);
  renewalEndDate1Year.setFullYear(renewalEndDate1Year.getFullYear() + 1);
  renewalEndDate1Year.setDate(renewalEndDate1Year.getDate() - 1);

  const renewalEndDate2Year = new Date(renewalStartDate);
  renewalEndDate2Year.setFullYear(renewalEndDate2Year.getFullYear() + 2);
  renewalEndDate2Year.setDate(renewalEndDate2Year.getDate() - 1);

  // Load the PDF form
  const formPdfBytes = await fetch("rtp-8-06-2023-fillable.pdf").then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  // Fill in the form fields
  setTextFieldValue(form, "Dated", date.toLocaleDateString("en-US", { month: "long", day: "2-digit" }));
  setTextFieldValue(form, "20", formatDate(date).slice(-2));
  setTextFieldValue(form, "Tenants Names and Address 1", tenantName1);
  setTextFieldValue(form, "Tenants Names and Address 2", tenantName2);
  setTextFieldValue(form, "Tenants Names and Address 3", tenantAddress1);
  setTextFieldValue(form, "Tenants Names and Address 4", tenantAddress2);
  setTextFieldValue(form, "Owners Agents Name and Address 2", ownerName);
  setTextFieldValue(form, "Owners Agents Name and Address 3", ownerAddress1);
  setTextFieldValue(form, "Owners Agents Name and Address 4", ownerAddress2);
  setTextFieldValue(form, "Text12", formatDate(leaseExpirationDate).replace(/\//g, String.prototype.padEnd(13)));
  setTextFieldValue(form, "undefined_2", formatNumber(currentRent));

  setTextFieldValue(form, "Text2", formatNumber(oneYearIncreasePercent * 100, 0));
  setTextFieldValue(form, "undefined_3", formatNumber(oneYearIncreaseAmount));
  setTextFieldValue(form, "Text3", formatNumber(twoYearIncreasePercentYear1 * 100, 0));
  setTextFieldValue(form, "Text4", formatNumber(twoYearIncreasePercentYear2 * 100, 0));
  setTextFieldValue(form, "undefined_7", formatNumber(twoYearIncreaseAmountYear1));
  setTextFieldValue(form, "undefined_8", formatNumber(twoYearIncreaseAmountYear2));

  setCheckboxValue(form, "Check Box14", preferentialRentCheckbox.checked);
  setTextFieldValue(form, "undefined_6", formatNumber(oneYearAmountTotal));
  setTextFieldValue(form, "undefined_11", formatNumber(twoYearAmountTotalYear1));
  setTextFieldValue(form, "undefined_12", formatNumber(twoYearAmountTotalYear2));

  setTextFieldValue(form, "Current Deposit", formatNumber(securityDeposit));
  setTextFieldValue(form, "Additional Deposit Required  1 year lease", formatNumber(oneYearAdditionalSecurityDeposit));
  setTextFieldValue(form, "Additional Deposit Required  2 year lease", formatNumber(twoYearAdditionalSecurityDepositYear1));
  setTextFieldValue(form, "undefined_13", formatNumber(twoYearAdditionalSecurityDepositYear2));

  setTextFieldValue(form, "a  Air conditioner", formatNumber(airConditionerFee));
  setTextFieldValue(form, "undefined_14", formatNumber(four21AFee));
  setTextFieldValue(form, "undefined_15", formatNumber(appliancesFee));
  setTextFieldValue(form, "Other", otherChargeName || "N/A");
  setTextFieldValue(form, "undefined_16", formatNumber(otherChargeAmount));
  setTextFieldValue(form, "Total separate charges", formatNumber(totalSeparateCharges));

  setTextFieldValue(form, "5 Different Rent to be charged if any  1 year lease", preferentialRentCheckbox.checked ? formatNumber(oneYearPreferentialAmountTotal) : "N/A");
  setTextFieldValue(form, "2 year lease", preferentialRentCheckbox.checked ? formatNumber(twoYearPreferentialAmountTotalYear1) : "N/A");
  setTextFieldValue(form, "undefined_17", preferentialRentCheckbox.checked ? formatNumber(twoYearPreferentialAmountTotalYear2) : "N/A");
  setCheckboxValue(form, "Check Box1", lowerRentCheckbox.checked);
  setCheckboxValue(form, "Check Box2", !lowerRentCheckbox.checked);

  setTextFieldValue(form, "6 Tenant shall pay a monthly rent enter amount from 2F or 5 of", formatNumber(oneYearRent));
  setTextFieldValue(form, "for a 1 year renewal or", formatNumber(twoYearRentYear1));
  setTextFieldValue(form, "undefined_18", formatNumber(twoYearRentYear2));
  setTextFieldValue(form, "for a 2 year renewal plus total separate charges enter amount from 4", formatNumber(totalSeparateCharges));
  setTextFieldValue(form, "undefined_19", formatNumber(oneYearRent + totalSeparateCharges));
  setTextFieldValue(form, "for a 1 year renewal  or", formatNumber(twoYearRentYear1 + totalSeparateCharges));
  setTextFieldValue(form, "undefined_20", formatNumber(twoYearRentYear2 + totalSeparateCharges));

  setTextFieldValue(form, "plus", formatNumber(oneYearRent));
  setTextFieldValue(form, "separate charges of", formatNumber(totalSeparateCharges));
  setTextFieldValue(form, "for a total monthly payment of", formatNumber(oneYearRent + totalSeparateCharges));
  setTextFieldValue(form, "See above explanation", formatNumber(twoYearRentYear1));
  setTextFieldValue(form, "undefined_22", formatNumber(twoYearRentYear2));
  setTextFieldValue(form, "plus separate charges of", formatNumber(totalSeparateCharges));
  setTextFieldValue(form, "for a total monthly payment of_2", formatNumber(twoYearRentYear1 + totalSeparateCharges));
  setTextFieldValue(form, "undefined_21", formatNumber(twoYearRentYear2 + totalSeparateCharges));

  setTextFieldValue(form, "7 This renewal lease shall commence on", formatDate(renewalStartDate));
  setTextFieldValue(form, "date of mailing or personal delivery of this Renewal Lease Form This Renewal Lease shall terminate on", formatDate(renewalEndDate1Year));
  setTextFieldValue(form, "lease or", formatDate(renewalEndDate2Year));

  setTextFieldValue(form, "the amount of", (scrieDrieRent ? formatNumber(scrieDrieRent) : "N/A"));

  setCheckboxValue(form, "Check Box4", sprinklerSystemCheckbox.checked);
  setCheckboxValue(form, "Check Box3", !sprinklerSystemCheckbox.checked);
  setTextFieldValue(form, "on", sprinklerSystemCheckbox.checked ? formatDate(lastInspected) : "N/A");

  form.flatten();

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();

  // update the UI with the new PDF
  document.getElementById("pdf").src = URL.createObjectURL(
    new Blob([pdfBytes], {
      type: "application/pdf",
    })
  );
}

function downloadPDF() {
  const tenantAddress = getFieldValue("tenantAddress1");
  const ExpirationDate = getFieldValue("leaseExpirationDate");
  const fileName = `Renewal Lease - ${tenantAddress} - ${ExpirationDate}.pdf`;
  const pdfUrl = document.getElementById("pdf").src;
  fetch(pdfUrl)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);

      const anchorElement = document.createElement('a');
      anchorElement.href = blobUrl;
      anchorElement.download = fileName;
      anchorElement.type = 'application/pdf';
      anchorElement.click();

      URL.revokeObjectURL(blobUrl);
    });
}
// Utility function to disable a field
function disableField(field) {
  field.disabled = true;
}

// Utility function to enable/disable a field based on a checkbox state
function toggleFieldState(checkboxState, field) {
  field.disabled = !checkboxState;
}

// Utility function to retrieve the value of an input field
function getFieldValue(id) {
  return document.getElementById(id).value;
}

// Utility function to retrieve the value of a radio group
function getRadioGroupValue(name) {
  const radioGroup = document.getElementsByName(name);
  for (let i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) {
      return radioGroup[i].value;
    }
  }
}

// Utility function to set the value of a text field in the PDF form
function setTextFieldValue(form, fieldName, value) {
  const textField = form.getTextField(fieldName);
  textField.setText(value);
}

// Utility function to set the value of a checkbox in the PDF form
function setCheckboxValue(form, fieldName, checked) {
  const checkbox = form.getCheckBox(fieldName);
  checked ? checkbox.check() : checkbox.uncheck();
}

// Utility function to parse a local date from a string
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
}

// Utility function to format a number as a currency
function formatNumber(number, minimumFractionDigits = 2, maximumFractionDigits = 2) {
  return number.toLocaleString("en-US", { minimumFractionDigits, maximumFractionDigits, });
}

// Utility function to format a date as "MM/DD/YYYY"
function formatDate(date) {
  if (date === null || isNaN(date)) return "Invalid Date"

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}
