const uploadCsvForBulkMsg = document.getElementById('uploadCsvForBulkMsg');
// document.getElementById("hideANdShowGroupSEction").style.display='none';
// document.getElementById("phoneNumInputField").style.display='none';


toggleCsvFileINput = () => {
  const selectFileOption = document.getElementById('selectFileOption');
  const uploadCsvForBulkMsg = document.getElementById('uploadCsvForBulkMsg');
  if (selectFileOption.checked) {
    uploadCsvForBulkMsg.style.display = 'block';
    phoneNumInputField.style.display = 'none';
    document.getElementById("hideANdShowGroupSEction").style.display = 'none';

  }
}
toggleCommaSeparatedInputField = () => {
  const commaSeparatedNumbersLikeArray = document.getElementById('commaSeparatedNumbersLikeArray');
  const phoneNumInputField = document.getElementById('phoneNumInputField');
  if (commaSeparatedNumbersLikeArray.checked) {
    phoneNumInputField.style.display = 'block'
    uploadCsvForBulkMsg.style.display = 'none'
    document.getElementById("hideANdShowGroupSEction").style.display = 'none';

  }
}
toggleSelectGroupInputfield = () => {
  const checkbox = document.getElementById("checkSElectGroup");
  if (checkbox.checked) {
    document.getElementById("hideANdShowGroupSEction").style.display = 'block';
    document.getElementById('uploadCsvForBulkMsg').style.display = 'none';

  }
}
