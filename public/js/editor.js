//select all checkboxes
function selectAll(){
	let checkboxes = document.getElementsByName('check')
	let btn = document.getElementById('check-btn')
	checkboxes.forEach( checkbox =>{
		if(checkbox.checked){
			checkbox.checked = false
			btn.checked = false
		}
		else{
			checkbox.checked = true
			btn.checked = true
		}

	})
}
//showing and hiding the reply box
function showReply(){
	var reply = document.getElementById("rply1")
	if(reply.style.display == "none"){
		reply.style.display == "block"
	}
	else{
		reply.style.display == "none"
	}
}
//show div
function showdiv(div){
	var team = document.getElementById("team")
	var member = document.getElementById('member')

	if(team.style.display == "block" && member.style.display == "block"){
		team.style.display = "none"
		member.style.display = "none"
	}

	if(div == "member"){
		if(member.style.display == 'block'){
			member.style.display = "none"
		}
		else{
			team.style.display = "none"
			member.style.display = "block"
		}
	}
	else{
		if(team.style.display == 'block'){
			team.style.display = "none"
		}
		else{
			member.style.display = "none"
			team.style.display = "block"
		}
	}
}

//open and close the nav bar
function displayNav(){
  var nav = document.getElementById("sidenav")
  if(nav.style.left == "0" ){
    nav.style.left = "-240px"
  }
  else{
    nav.style.left = "-240px"
  }
}

//hide nav
function hideNav() {
	document.getElementById("sidenav").style.left = "-240px"
}

//show change priviledge form
function showForm(id, name, role){
	var form = document.getElementById("priviledge-form")
	form.style.visibility = "visibible"
	form.elements.name.value = name
	form.elements.role.value = role
	form.action = "users/" +id+"/change"
}
// //sort data in table
// function sortTable(n){
// 	//parameters
// 	var table, rows, switching, i, x, y, shouldShwith, dir, switchcount = 0
// 	//get target table
// 	table = document.getElementById('sortable')
// 	switching = true
// 	dir = "asc"
// 	//loop as long as no switching as been done
// 	while(switching){
// 		switching = false
// 		rows = table.rows

// 		for( i = 1; i < rows.length; i++){
// 			shouldShwith = false
// 			x = rows[i].getElementsByTagName("TD")[n]
// 			y = rows[i + 1].getElementsByTagName("TD")[n]

// 			if(dir == "asc"){
// 				if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
// 					shouldShwith = true
// 					break
// 				}
// 			}
// 			else if(dir == "desc"){
// 				if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
// 					shouldShwith = true
// 					break
// 				}
// 			}
// 		}

// 		if(shouldShwith){
// 			rows[i].parentNode.insertBefore( rows[i + 1], rows[i])
// 			switching = true
// 			switchcount ++
// 		} else {
// 			if( switchcount == 0 && dir == "asc"){
// 				dir = "desc"
// 				switching = true
// 			}
// 		}
// 	}
// }