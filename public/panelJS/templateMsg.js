// sendBulkTemplateMsgWithINputField = () => {
//   let mobileNumber = document.getElementById("phoneNumOfTemp").value;
//   let template = document.getElementById("tempOfBtn").value;
//   let useNum = mobileNumber.split(",");
//   let finalNum = useNum.map((element) => element.trim());
//   finalNum.forEach((element) => {
//     const data = {
//       messaging_product: "whatsapp",
//       to: `${element}`,
//       type: "template",
//       template: {
//         name: `${template}`,
//         language: {
//           code: "en_US",
//         },
//       },
//     };
//     const result = fetch(
//       "https://graph.facebook.com/v17.0/104022815935352/messages/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     )
//       .then((response) => {
//         if (response.ok) {
//           console.log(`Message send Successfully..${ element } `);

//           if (result) {
//             const param1Value = document.getElementById("phoneNumOfTemp").value;
//             const param2Value = document.getElementById("tempOfBtn").value;
//             fetchDataFromApi(param1Value, param2Value);
//             showingMessage();
//           }
//         } else {
//           console.log(`Can not send message ${ element } `);
//         }
//       })
//       .catch((error) => {
//         console.log(`Can not send Message to this Number${ element } `);
//       });
//     function showingMessage() {
//       document.getElementById("showSucessMessage").style.display = "block";
//       document.getElementById(
//         "showSucessMessage"
//       ).innerHTML = `< h4 class="m-auto" > <i class="fa fa-check" aria-hidden="true"></i>
//             Message Has been Send Successfully...</h4>`;
//     }
//     function hidingScsMsg() {
//       document.getElementById("showSucessMessage").innerHTML = "";
//     }
//     setTimeout(hidingScsMsg, 5000);
//   }); //  loop ends
//   // Function to fetch data from the API with two parameters
//   function fetchDataFromApi(param1, param2) {
//     const url = `/api/savetemplateentry/` + param1 + `/` + param2;
//     fetch(url) // This matches the route defined on the server
//       .then((response) => response.json())
//       .then((data) => {})
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }
// };

// add here

// add here



// sendBulkTemplateMsgWithCsvFile = () => {
//   const fileInput = document.getElementById("excelFile");
//   const messageContent = document.getElementById("tempOfBtn").value;

//   const file = fileInput.files[0];
//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: "array" });

//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const phoneColumn = 1; // Adjust column index for phone numbers
//     const numbers = jsonData.map((row) => row[phoneColumn]);

//     numbers.forEach((number) => {
//       // sendMessage(number, messageContent);
//       const dataCollections = {
//         messaging_product: "whatsapp",
//         to: `${number}`,
//         type: "template",
//         template: {
//           name: `${messageContent}`,
//           language: {
//             code: "en_US",
//           },
//         },
//       };
//       const result = fetch(
//         "https://graph.facebook.com/v17.0/104022815935352/messages/",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(dataCollections),
//         }
//       )
//         .then((responses) => {
//           if (responses.ok) {
//             console.log(`Bulk messages sent successfully ${ number } `);
//             if (result) {
//               showingMessage();
//             }
//           } else {
//             console.log(`Bulk messages not sent ${ number } `);
//           }
//         })
//         .catch((error) => {
//           console.error("Error sending bulk messages:", error);
//         });
//       function showingMessage() {
//         document.getElementById(
//           "showSucessMessage"
//         ).innerHTML = `< h4 class="m-auto" > <i class="fa fa-check" aria-hidden="true"></i>
//                     Message Has been Send Successfully...</h4>`;
//       }
//       function hidingScsMsg() {
//         document.getElementById("showSucessMessage").innerHTML = "";
//       }
//       setTimeout(hidingScsMsg, 5000);
//     });
//   };
//   reader.readAsArrayBuffer(file);
// };

// validation for template message starts
// phoneValidation = () => {
//   let phoneNo = document.getElementById("phoneNumOfTemp").value;
//   if (phoneNo == "") {
//     document.getElementById("phError").innerText =
//       "! **Please Enter mobile number..";
//     document.getElementById("phoneNumOfTemp").style.borderColor = "red";
//   } else if (isNaN(phoneNo)) {
//     document.getElementById("phError").innerHTML =
//       "** Please Enter Only Number";
//     document.getElementById("phoneNumOfTemp").style.borderColor = "red";
//   } else if (phoneNo.length < 10) {
//     document.getElementById("phError").innerText =
//       "! **mobile number is too short..";
//     document.getElementById("phoneNumOfTemp").style.borderColor = "red";
//   } else {
//     document.getElementById("phError").innerText = "";
//     document.getElementById("phoneNumOfTemp").style.borderColor = "green";
//     return true;
//   }
// };

// selectTemplateValidation = () => {
//   let templateName = document.getElementById("tempOfBtn").value;
//   if (templateName == "") {
//     document.getElementById("selError").innerText =
//       "! **Please Select template..";
//     document.getElementById("tempOfBtn").style.borderColor = "red";
//   } else {
//     document.getElementById("selError").innerText = "";
//     document.getElementById("tempOfBtn").style.borderColor = "green";
//   }
// };

// attachFileValidation = () => {
//   let attachFile = document.getElementById("excelFile").value;
//   if (attachFile == "") {
//     document.getElementById("attachFileError").innerText =
//       "! **Please Attach Your File First";
//     document.getElementById("excelFile").style.borderColor = "red";
//   } else {
//     document.getElementById("excelFile").style.borderColor = "green";
//     document.getElementById("attachFileError").innerText = "";
//   }
// };
// validation for template message Ends

// parentFuncOf = () => {
//   if (phoneValidation() || selectTemplateValidation()) {
//       selectTemplateValidation()
//   sendBulkTemplateMsgWithINputField();
//   sendBulkTemplateMsgWithCsvFile();
//   } else {
//       attachFileValidation()
//       sendBulkTemplateMsgWithCsvFile();
//   }
// }
