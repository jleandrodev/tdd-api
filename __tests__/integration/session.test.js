const factory = require('../factories')

const app = require('../../src/app')
const request = require('supertest')
const truncate = require('../utils/truncate')

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate()
    })
    
    it('Should authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })
        
        expect(response.status).toBe(200)

    })

    it('Shoud not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '12345'
            })
        
        expect(response.status).toBe(401)
    })


    it('Should return jwt token when authenticate', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123456'
            })
        
        expect(response.body).toHaveProperty('token')

    })

    it('Should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123456'
        })

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`)
        
        expect(response.status).toBe(200)

    })

    it('Should not be able to access private routes when not authenticated', async () => {
        const response = await request(app).get('/dashboard')

        
        expect(response.status).toBe(401)

    })

    it('Should not be able to acces private routes with invalid jwt token', async () => {


        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer 123123`)
        
        expect(response.status).toBe(401)
    })
    


})