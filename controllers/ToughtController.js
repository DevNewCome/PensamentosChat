const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController{
  static async showToughts(req, res) {
    res.render('toughts/home')
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

    res.render('toughts/dashboard', { toughts })
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
}