import { Controller } from 'stimulus'
import StimulusReflex from 'stimulus_reflex'

class NewClientFormController extends Controller {
  connect() {
    StimulusReflex.register(this)
  }

  search(event) {
    event.preventDefault()
    console.log(this.data.get('reflex'))
    this.stimulate('NewClientFormReflex#search')
  }
  update(event) {
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
    this.stimulate('NewClientFormReflex#new_client')
  }
  select(event) {
    event.preventDefault()
    let pk = event.target.parentNode.dataset.id
    this.stimulate('NewClientFormReflex#select', pk)
  }
}

export default NewClientFormController;
