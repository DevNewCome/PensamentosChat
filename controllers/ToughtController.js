const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController{

  static async showToughts(req, res) {
    const toughtsData = await Tought.findAll({
      include: User,
    })
    const toughts = toughtsData.map((result)=> result.get({plain: true}))
    res.render('toughts/home', {toughts})
  }



  static async dashboard(req,res) {
    const userId = req.session.userid
    const user = await User.findOne({
      where: {
        id: userId,
      },   
      include: Tought,
      plain: true,
    })

    //check if user exist
    if(!user) {
      res.redirect('/login')
    }

    const toughts = user.Toughts.map((result)=> result.dataValues) // pegando só o pensamento do user

    let emptyToughts = true

    if (toughts.length > 0) {
      emptyToughts = false
    }

    //console.log(toughts)
    //console.log(emptyToughts)

    res.render('toughts/dashboard', { toughts, emptyToughts })
  }

  static createTought(req, res) {
    res.render('toughts/create')
  }

  static async createToughtSave(req, res) {
      const tought = {
        title: req.body.title,
        UserId: req.session.userid
      }

      try {
        await Tought.create(tought)
        req.flash('message', 'pensamento criado com sucesso')
        req.session.save(()=>{
         res.redirect('/toughts/dashboard')
        })
      }catch (error){
          console.log(error)
      }
       
  }


  static removeTought(req, res) {
    const id = req.body.id

    Tought.destroy({ where: { id: id } })
      .then(() => {
        req.flash('message', 'Pensamento removido com sucesso!')
        req.session.save(() => {
          res.redirect('/toughts/dashboard')
        })
      })
      .catch((err) => console.log())
  }

  static async updateTought(req, res){
    const id = req.params.id
    const tought = await Tought.findOne({where: {id: id}, raw: true})
    res.render('toughts/edit', { tought })
  }

  static updateToughtPost(req, res) {
    const id = req.body.id

    const tought = {
      title: req.body.title,
      description: req.body.description,
    }
}

static updateToughtPost(req, res) {
  const id = req.body.id
  const tought = {
    title: req.body.title,
    description: req.body.description,
  }

  Tought.update(tought, { where: {id: id}})
    .then(()=>{
      req.flash('message', 'Pensamento atualizado com sucesso!')
      req.session.save(()=>{
        res.redirect('/toughts/dashboard')
      })
    })
    .catch((err) => console.log())

}

}