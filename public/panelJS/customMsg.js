// normalCustomMsg = () => {
//   let phoneNo = document.getElementById('phone').value
//   let ctMsg = document.getElementById('customMsgInputField').value
//   let useNum = phoneNo.split(',');
//   let finalNum = useNum.map((element) => element.trim());

//   finalNum.forEach(element => {
//     // const APIendpoint='https://graph.facebook.com/v17.0/104022815935352/messages/';
//     let data = {
//       "messaging_product": "whatsapp",
//       "recipient_type": "individual",
//       "to": `+91${element}`,
//       "type": "text",
//       "text": {
//         "body": `${ctMsg}`
//       },
//     }
//     const result = fetch('https://graph.facebook.com/v17.0/104022815935352/messages/', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data)
//     })
//       .then((response) => {
//         if (response.ok) {
//           console.log(`Message send Successfully..${ element } ${ response } `);
//         } else {
//           console.log(`Can not send message to this number ${ element } `);
//         }
//       }).catch((error) => {
//         console.log(`Can not send Message to this Number${ error } `);
//       })
//   }) //  loop ends
// }


attachandSendImgAPI = () => {
  // https://loremflickr.com/640/360
  let phoneNo = document.getElementById('phone').value
  let attachment = document.getElementById('attachmentURL').value
  let writeMsg = document.getElementById('customMsgInputField').value
  let useNum = phoneNo.split(',');
  let finalNum = useNum.map((element) => element.trim());

  finalNum.forEach(element => {
    const data = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": `${ element } `,
      "type": "image",
      "image": {
        "link": `${ attachment } `,
        "caption": `${ writeMsg } `
      },
    };
    const result = fetch('https://graph.facebook.com/v17.0/104022815935352/messages/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Message send Successfully..${ element } `);
          if (result) {
            showingMessage();
          }
        } else {
          console.log(`Can not send message ${ element } `);
        }
      }).catch((error) => {
        console.log(`Can not send Message to this Number${ error } `);
      })
    function showingMessage() {
      document.getElementById('showSucessMessage').innerHTML = `< h3 class="m-auto" > <i class="fa fa-check" aria-hidden="true"></i>
              Message Has been Send Successfully...</h3 > `
    }
    function hidingScsMsg() {
      document.getElementById('showSucessMessage').innerHTML = ''
    }
    setTimeout(hidingScsMsg, 5000)

  })
}

// sendBulkCustomMsgWithCsvFile = () => {
//   const input = document.getElementById('customMsgExcelFile');
//   const messageContent = document.getElementById('customMsgInputField').value;
//   const file = input.files[0];

//   if (!file) {
//       alert("No file selected.");
//       return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const phoneColumn = 0; // Adjust column index for phone numbers
//     const numbers = jsonData.map(row => row[phoneColumn]);
//     numbers.forEach(number => {
//       // sendMessage(number, messageContent);
//       const dataCollections = {
//         "messaging_product": "whatsapp",
//         "recipient_type": "individual",
//         "to": `${ number } `,
//         "type": "text",
//         "text": {
//           "body": `${ messageContent } `
//         }
//       }
//       const result = fetch('https://graph.facebook.com/v17.0/104022815935352/messages/', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataCollections)
//       })
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
//           console.error('Error sending bulk messages:', error);
//         })
//       function showingMessage() {
//         document.getElementById('showSucessMessage').innerHTML = `< h4 class="m-auto" > <i class="fa fa-check" aria-hidden="true"></i>
//                   Message Has been Send Successfully...</h4>`
//       }
//       function hidingScsMsg() {
//         document.getElementById('showSucessMessage').innerHTML = ''
//       }
//       setTimeout(hidingScsMsg, 5000)
//     });
//     console.log(numbers);
//   };

//   reader.readAsArrayBuffer(file);
// }

// sendBulkCustomMsgWithCsvAndAttachments = () => {
//   const input = document.getElementById('customMsgExcelFile');
//   let attachment = document.getElementById('attachmentURL').value
//   const messageContent = document.getElementById('customMsgInputField').value;
//   const file = input.files[0];
//   if (!file) {
//       alert("No file selected.");
//       return;
//   }
//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     const phoneColumn = 0; // Adjust column index for phone numbers
//     const numbers = jsonData.map(row => row[phoneColumn]);
//     numbers.forEach(number => {
//       // sendMessage(number, messageContent);
//       const dataCollections = {
//         "messaging_product": "whatsapp",
//         "recipient_type": "individual",
//         "to": `${number}`,
//         "type": "image",
//         "image": {
//           "link": `${attachment}`,
//           "caption": `${messageContent}`
//         },
//       }
//       const result = fetch('https://graph.facebook.com/v17.0/104022815935352/messages/', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer zxcvbnmlkjhgfdswertyunbnbzvxcvbsagfjkfdjkjhkjwouoriuhsdd
WHATSAAP_TOKEN = EAAWqeZCMrJ6sBO0X7XRm9sUzT9VDnllTw54ul2YUHhh5UW8IdzCWZAQLSsNomFx6cBQJbWt7Kzsad6MnAE8Ge64EnMRALBpirjamhEXC56gxj4eZBrCV2BQoNZAkb2ZCPs8ZCEm5iq5DFvVFOhRgVo9NCx7z9TuogsSliZBv4wqrvQdm14DnzI8HyZAUkmT5yJYzwJgMwEWPcKRvA7DF`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataCollections)
//       })
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
//           console.error('Error sending bulk messages:', error);
//         })
//       function showingMessage() {
//         document.getElementById('showSucessMessage').innerHTML = `< h4 class="m-auto" > <i class="fa fa-check" aria-hidden="true"></i>
//                   Message Has been Send Successfully...</h4>`
//       }
//       function hidingScsMsg() {
//         document.getElementById('showSucessMessage').innerHTML = ''
//       }
//       setTimeout(hidingScsMsg, 5000)
//     });
//     console.log(numbers);
//   };

//   reader.readAsArrayBuffer(file);
// }



// ------------------validation starts-----------------------
// phone number validation
// phoneNumberOfCustomMessageValidation = () => {
//   let phone = document.getElementById('phone').value;
//   if (phone == "") {
//     document.getElementById('phoneError').innerText = '! **Please Enter mobile number..'
//     document.getElementById('phone').style.borderColor = 'red';
//   }

//   else if (isNaN(phone)) {
//     document.getElementById('phoneError').innerHTML = '** Please Enter Only Number'
//     document.getElementById('phone').style.borderColor = 'red';
//   }
//   else if (phone.length < 10) {
//     document.getElementById('phoneError').innerText = '! **mobile number is too short..'
//     document.getElementById('phone').style.borderColor = 'red';
//   }
//   else {
//     document.getElementById('phoneError').innerText = ''
//     document.getElementById('phone').style.borderColor = 'green';
//     return true;
//   }
// }

// // custom message field validation
// InputValidationOfCustomMsg = () => {
//   let cstMsgVal = document.getElementById('customMsgInputField').value
//   if (cstMsgVal == "") {
//     document.getElementById('customFieldError').innerHTML = '! **Please Write your message here ..';
//     document.getElementById('customMsgInputField').style.borderColor = 'red';
//   }
//   else {
//     document.getElementById('customMsgInputField').style.borderColor = 'green';
//     document.getElementById('customFieldError').innerHTML = ''
//   }
// }

// fileinputErrorValidation = () => {
//   let excelFile = document.getElementById('customMsgExcelFile').value

//   if (!excelFile) {
//     document.getElementById('fileNotSelect').innerHTML = '***please attached your file'
//   } else {
//     document.getElementById('fileNotSelect').innerHTML = ''
//   }
// }
// ------------------validation Ends-----------------------



// this code is not working properly check it latter
sendCustomMsgWithIncludingMedia = () => {

  const allAttachmentsInclude = document.getElementById('allAttachmentsInclude');
  const customMsgCheckbox = document.getElementById('customMsgCheckbox');
  // phoneNumberOfCustomMessageValidation();
  // InputValidationOfCustomMsg();

  if (allAttachmentsInclude.checked || customMsgCheckbox) {
    attachandSendImgAPI();
  } else {
    normalCustomMsg();
  }
  if (allAttachmentsInclude.checked) {
    sendBulkCustomMsgWithCsvAndAttachments();
  } else {
    normalCustomMsg();
  }


}

