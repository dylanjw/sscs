import { Controller } from 'stimulus'
import StimulusReflex from 'stimulus_reflex'

class NewClientFormController extends Controller {
  connect() {
    StimulusReflex.register(this)
  }

  search(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    this.stimulate('NewClientFormReflex#search')
  }
  update(event) {
    //document.getElementById("field_errors").classList.add("d-none")
    event.preventDefault()
    console.log(event.target)
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
  toggle_edit(event) {
    event.preventDefault()
    this.stimulate('NewClientFormReflex#toggle', 'edit')
  }
  toggle_search(event) {
    event.preventDefault()
    this.stimulate('NewClientFormReflex#toggle', 'search')
    document.getElementById("client_table").reset()
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
  paginate(event) {
    event.preventDefault()
    let page = event.target.dataset.page
    if (!event.target.classList.contains("disabled")) {
      this.stimulate('NewClientFormReflex#paginate', page)
    }
  }
}

export default NewClientFormController;
