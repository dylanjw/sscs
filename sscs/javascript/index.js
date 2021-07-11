import { Application } from 'stimulus'
import StimulusReflex from 'stimulus_reflex'
import WebsocketConsumer from 'sockpuppet-js'
import NewClientFormController from './controllers.js'


const application = Application.start()
const consumer = new WebsocketConsumer('wss://'+ window.location.host + '/ws/sockpuppet-sync')

application.register('new_client', NewClientFormController)
console.log(application)
application.consumer = consumer
StimulusReflex.initialize(application, {debug: true })
