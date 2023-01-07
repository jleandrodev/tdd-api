const { User } = require('../../src/app/models')
const bcrypt = require('bcryptjs')

const truncate = require('../utils/truncate')

describe('User', () => {
    beforeEach(async () => {
        await truncate()
    })

    it('Should encrypt user password', async () => {

        const user = await User.create({
            name: 'Jhone',
            email: 'jhone@email.com',
            password: '123456'
        })

        const hash = await bcrypt.compare('123456',user.password_hash)

        expect(hash).toBe(true)
    })

    
})

