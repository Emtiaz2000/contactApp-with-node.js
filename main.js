const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const path = require('path')
const Idendity = require('./db/db.js')
const methodOverride = require('method-override')


//middlewere
app.use(methodOverride('_method'))
app.use(express.static( __dirname + "/public"));
app.use(express.urlencoded({
    extended: false
}))
app.engine('.hbs', exphbs({
    extname: '.hbs'
}))
app.set('view engine', '.hbs')


//connect database
async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://admin:admin1234@idendity.wxfp6.mongodb.net/Idendity?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('database is connected')
    } catch (error) {
        console.log(error)
    }

}
connectDB()


app.get('/', async (req, res) => {
    
    try {
        const idendity = await Idendity.find()
        const idendities = {
            data: idendity.map(element => {return{id:element._id,name:element.name,email:element.email,profession:element.profession}} )
        }
       //console.log(idendities.data)
        res.render('home', {
            ID: idendities.data,
            title: 'Contact App'
        })
    } catch (error) {
        res.send('404 NOT Found')
    }
   
})

app.post('/', async (req, res) => {
    const idendity = new Idendity({
        ...req.body
    })
    await idendity.save()
    res.redirect('/')
})

app.get('/edit/:id',async (req,res)=>{
    const id = req.params.id
    
    try {
        const idendity = await Idendity.findById(id)
    const contex = {id:idendity.id,name:idendity.name,email:idendity.email,profession:idendity.profession}
        if(idendity){
            res.render('edit',{
                idendity:contex
            })
        }else{
            res.send('404 not found')
        }
    } catch (error) {
        res.send('404 not found')
    }
   

})

app.put('/edit/:id',async (req,res)=>{
    const id = req.params.id
    const value = req.body
    const newIdendity = await Idendity.findByIdAndUpdate(id,value,{ useFindAndModify:false})
    try {
    if(newIdendity){
        res.redirect(`/`)
    }else{
        res.send('404 not found')
    }
    } catch (error) {
        res.send('404 not found')
    }
    
})

app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id
    const idendity = await Idendity.findById(id)
    const contex = {id:idendity.id,name:idendity.name,email:idendity.email,profession:idendity.profession}
    try {
        if(idendity){
            res.render('delete',{
                idendity:contex
            })
        }
    } catch (error) {
        res.send('404 not found')
    }
   
})
app.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id
    const deleteIdendity = await Idendity.findByIdAndDelete(id,{ useFindAndModify:false})
    if(deleteIdendity){
        res.redirect('/')
    }else{
        res.send('404 not found')
    }
})

app.listen(8000, () => {
    console.log('port is listening')
})