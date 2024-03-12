// // pagination starts
// document.addEventListener("DOMContentLoaded", function () {
//     const table = document.getElementById("viewDataPage");
//     const tbody = table.querySelector("tbody");
//     const rows = Array.from(tbody.getElementsByTagName("tr"));
//     let perPage = 5; // Default number of rows per page
//     let currentPage = 1;

//     function displayRows() {
//         const startIndex = (currentPage - 1) * perPage;
//         const endIndex = startIndex + perPage;
//         rows.forEach((row, index) => {
//             if (index >= startIndex && index < endIndex) {
//                 row.style.display = "table-row";
//             } else {
//                 row.style.display = "none";
//             }
//         });
//         document.getElementById("currentPage").textContent = `Page ${currentPage}`;
//         updatePaginationButtons();
//     }

//     function updatePaginationButtons() {
//         const totalPages = Math.ceil(rows.length / perPage);
//         const prevPageBtn = document.getElementById("prevPageBtn");
//         const nextPageBtn = document.getElementById("nextPageBtn");

//         prevPageBtn.disabled = currentPage === 1;
//         nextPageBtn.disabled = currentPage === totalPages;
//     }

//     const prevPageBtn = document.getElementById("prevPageBtn");
//     const nextPageBtn = document.getElementById("nextPageBtn");
//     const itemsPerPageInput = document.getElementById("itemsPerPage");

//     prevPageBtn.addEventListener("click", () => {
//         if (currentPage > 1) {
//             currentPage--;
//             displayRows();
//         }
//     });

//     nextPageBtn.addEventListener("click", () => {
//         const totalPages = Math.ceil(rows.length / perPage);
//         if (currentPage < totalPages) {
//             currentPage++;
//             displayRows();
//         }
//     });

//     // Apply button for changing items per page
//     const applyItemsPerPageBtn = document.getElementById("applyItemsPerPage");
//       showPerpageByEnterVal=()=>{
//         perPage = parseInt(itemsPerPageInput.value, 10);
//         currentPage = 1;
//         displayRows();
//       }
//     // });

//     displayRows();
// });
// pagination ends



// seacrch functionality code start
function searchHere() {

  const searchInput = document.getElementById("searchInput");
  const viewDataPage = document.getElementById("viewDataPage").getElementsByTagName("tbody")[0];

  event.preventDefault();
  const searchQuery = searchInput.value.trim().toLowerCase();
  if (searchQuery === "") {
    // If search query is empty, show all rows
    const rows = viewDataPage.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = ""; // Show the row
    }
  } else {

    const rows = viewDataPage.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowText = row.textContent.toLowerCase();


      if (rowText.includes(searchQuery)) {
        row.style.display = ""; // Show the row
      } else {
        row.style.display = "none"; // Hide the row if it doesn't match the search query
      }
    }
  }
}
// seacrch functionality code Ends





// add the Group
function selectAll() {
  var selectAllButton = document.getElementById("selectAllbox");
  var checkboxes = document.querySelectorAll(".user-checkbox");
  var selectedIds = [];

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = !checkboxes[i].checked;

    if (checkboxes[i].checked) {
      // Extract the value attribute, which contains the _id
      var id = checkboxes[i].getAttribute("value");
      selectedIds.push(id);
    }
  }

  // Update the text of the "Select All" button
  if (selectAllButton.textContent === "Select All") {
    selectAllButton.textContent = "Select All";
  } else {
    selectAllButton.textContent = "Select All";
  }

  // Now, the selectedIds array contains the _id values of selected checkboxes
  // console.log("Selected IDs: ", selectedIds);
}




// Function to assign Groups to selected items and update the client-side table
function assignGroupToSelected() {
  var selectedGroup = document.getElementById("Group").value;
  var checkboxes = document.querySelectorAll(".user-checkbox:checked");
  var selectedIds = [];

  checkboxes.forEach(function (checkbox) {
    var id = checkbox.value;
    var currentGroup = checkbox.closest("tr").querySelector("td:nth-child(4)").textContent;

    if (selectedGroup !== currentGroup) {
      selectedIds.push(id);
    }
  });

  if (selectedGroup !== "" && selectedIds.length > 0) {
    var data = {
      Group: selectedGroup,
      selectedIds: selectedIds,
    };

    fetch("/updateGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fetch failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}







// add the Group












//   // Function to collect selected users' data when the "Group" button is clicked
//   function getSelectedUsersData() {
//     console.log("new world");
//     const selectedUsers = [];
//     const checkboxes = document.querySelectorAll('.user-checkbox:checked');

//     checkboxes.forEach(checkbox => {
//         const row = checkbox.closest('tr');
//         const userData = {
//             name: row.querySelector('.oops').textContent,
//             mobile: row.querySelector('td:nth-child(3)').textContent,
//             Groups: row.querySelector('td:nth-child(4)').textContent
//         };
//         selectedUsers.push(userData);
//     });

//     return selectedUsers;
// }



// // Function to send selected user data and enter newGroup to the server for bulk editing
// function submitBulkEditForm() {
//     console.log("submitbutton is called");
//     // Disable the "Save" button to prevent multiple submissions
// const saveButton = document.getElementById('saveButton');
// saveButton.disabled = true;
//     const newGroup = document.getElementById('newGroupInput').value; // Get the new Group value
//      const selectedUsers = getSelectedUsersData();
//    console.log(selectedUsers);
//     // Check if selectedUsersData is an array before proceeding
//    // Extract and log the names of selected users


//  const cleanedUsers = selectedUsers.map(user => ({
//     name: user.name.trim(),
//     mobile:(typeof user.mobile === 'string' ? user.mobile.replace(/[\n\r\s]+/g, '') : user.mobile),
//     Groups: user.Groups.replace(/[\n\r\s]+/g, '')
// }));
// console.log(cleanedUsers);
// console.log("selection successfull");



// const selectedUserGroups = selectedUsers.map(user => user.Groups.replace(/[\n\r\s]+/g, ''));
// console.log('Selected User Names:', selectedUserGroups);

// // Clean up the data (remove extra whitespace and newline characters)


//  // Create a new array to store cleaned user data


//    console.log("successfully");


//     // Send the selectedUsersData and newGroup to the server for bulk editing using fetch or AJAX
//     fetch('/bulk-edit', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({  cleanedUsers , newGroup })
//         // Send the data as JSON
//     })
//         .then(response => {
//             // Handle the response from the server
//             if (response.ok) {
//               console.log("successfully!!!!");
//                 console.log('Bulk edit successful');

//             } else {
//                 // Handle errors
//                 console.log("unsuccessfully!!!!");
//                 console.error('Bulk edit failed');
//             }
//         })
//         .catch(error => {
//             console.error('Error sending data:', error);
//         }).finally(() => {
//         // Re-enable the "Save" button after the request is complete
//         saveButton.disabled = false;
//     });
// }
// // Add an event listener to the "Group" button to collect and send selected user data
// const editButton = document.getElementById('intialGroupBtn');
// editButton.addEventListener('click', function () {
//   console.log("radhe");
//   openGroupModal();
//   //  const selectedUser = getSelectedUsersData(); // Call getSelectedUsersData() here

// });
// // Add an event listener to the "Save" button to submit the bulk editing form
// const saveButton = document.getElementById('saveButton');
// saveButton.addEventListener('click', function(){
//   console.log("seeta");
//   submitBulkEditForm();
//   closeGroupModal();
// });

//                       // Get references to the modal and form
//                       var GroupModal = document.getElementById("GroupModal");
//                       var GroupForm = document.getElementById("GroupForm");

//                       // Function to open the modal
//                       function openGroupModal() {
//                         GroupModal.style.display = "block";
//                       }

//                       // Function to close the modal
//                       function closeGroupModal() {
//                         GroupModal.style.display = "none";
//                       }


//                       // <!-- modal after for Group edit -->
//                       var selectedUserIds = []; // Declare the array outside the function
//                       function selectAll() {

//                         var checkboxes = document.querySelectorAll('.user-checkbox');
//                         var selectAllButton = document.getElementById('selectAllbox');
//              // Clear the array when the "Select All" button is clicked to start fresh
//         selectedUserIds = [];
//                         // Check or uncheck all checkboxes based on the button state
//                         var isChecked = selectAllButton.innerHTML === "Select All";
//                         for (var i = 0; i < checkboxes.length; i++) {
//                             checkboxes[i].checked = isChecked;
//                              // Collect the selected user IDs
//             if (isChecked) {
//               selectedUserIds.push(checkboxes[i].value);
//           }
//                         }
//              // Log all the user IDs in the checkboxes
//     for (var i = 0; i < checkboxes.length; i++) {
//       console.log(checkboxes[i]);
//       console.log(checkboxes[i].getAttribute("value"));
//   }
//                         // Toggle the button text
//                         selectAllButton.innerHTML = isChecked ? "Deselect All" : "Select All";
//                   // You can use the selectedUserIds array to store or process the selected user IDs.
//         // Log the collected values for debugging

//         console.log(selectedUserIds);



//                       }



// // // Group

