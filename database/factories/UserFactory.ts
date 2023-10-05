import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export default Factory.define(User, ({ faker }) => {
  return {
    name: 'Oi',
    email: 'a',
    doc: ,
    password: ,
    birthday: ,
    phoneNumber: ,
    type: 'USER',

  }
}).build()
