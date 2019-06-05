const express = require('express')
const router = express.Router()

const pool = require('../database') // Reclamo una conexión del pool de conexiones

router.get('/add', (req, res) => {
    res.render('links/add')
})

router.post('/add', async (req, res)=> {
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description
    }
    await pool.query('INSERT INTO links set ?', [newLink])
    res.redirect('/links')
})

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links')
    res.render('links/list', {links})
})

router.get('/delete/:id', async (req, res)=> {
    const { id } = req.params
    await pool.query("DELETE FROM links WHERE id = ?",[id])
    res.redirect('/links')
})

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const link = await pool.query('SELECT * FROM links WHERE id = ?',[id])
    console.log(link)
    res.render('links/edit', {link: link[0]})
})

router.post('/edit/:id', async (req,res) => {
    const { id } = req.params
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description
    }

    await pool.query('UPDATE links SET title = ?, url = ?, description = ? WHERE id = ?', [title, url, description, id])
    res.redirect('/links')
})


module.exports = router