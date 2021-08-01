import { Controller } from 'stimulus'
import StimulusReflex from 'stimulus_reflex'
import { reload_datepickers, toggle_mode } from './utils.js'

class NewClientFormController extends Controller {
  connect() {
    StimulusReflex.register(this)
  }
  search(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    this.stimulate('NewClientFormReflex#search')
  }
  add_family_member(event) {
    event.preventDefault()
    let [_, family_index] = document.querySelector(".row.edit-family").attributes.id.value.split("-")
    this.stimulate('NewClientFormReflex#add_family', family_index)
  }
  delete_family_member(event) {
    event.preventDefault()
    this.stimulate('NewClientFormReflex#delete_family_member');
  }
  finalizeAddFamily(element) {
    console.log("finalizeAddFamily")
    toggle_mode('edit')
  }
  finalizeDeleteFamilyMember(element) {
    toggle_mode('edit')
  }
  update(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    console.log(event.target)
    if (
          !event.target.parentNode.classList.contains("family_field")
        && !event.target.parentNode.parentNode.classList.contains("family_field")
    ) {
      let name = event.target.name.split("-")
      let form = name[0]
      let field = name[1]
      let value = event.target.value
      this.stimulate(
        'NewClientFormReflex#update', 
        {
          form: form, field: field, value: value
        }
      )
    }
  }
  toggle_edit(event) {
    event.preventDefault()
    reload_datepickers()
    this.stimulate('NewClientFormReflex#toggle', 'edit')
  }
  toggle_search(event) {
    event.preventDefault()
    document.getElementById("client_form").reset()
    this.stimulate('NewClientFormReflex#toggle', 'search')
  }
  finalizeToggle(element) {
    console.log("in finalizeToggle");
    let mode = document.getElementById("mode_val").value
    console.log("finalizeToggle")
    toggle_mode(mode)
    reload_datepickers()
  }
  new_client(event) {
    event.preventDefault()
    document.getElementById("field_errors").classList.remove("d-none")
    this.stimulate('NewClientFormReflex#new_client')
  }
  select(event) {
    event.preventDefault()
    let pk = event.target.parentNode.dataset.id
    this.stimulate('NewClientFormReflex#select', pk)
  }
  finalizeSelect(element) {
    console.log("finalizeSelect")
    toggle_mode('view')
  }
  paginate(event) {
    event.preventDefault()
    let page = event.target.dataset.page
    if (!event.target.classList.contains("disabled")) {
      this.stimulate('NewClientFormReflex#paginate', page)
    }
  }
}

export default NewClientFormController;
