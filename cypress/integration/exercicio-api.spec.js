/// <reference types="cypress" />
var faker = require('faker');
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token

     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })

     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });


     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(50)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Aluno EBAC1 ${Math.floor(Math.random() * 100000000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Aluno EBAC1",
                    "email": faker.internet.email(),
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')

          })
     });


     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, 'Aluno Ebac44', 'fulano@qa.com.br', 'teste123')
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')

               })
     });



     it('Deve editar um usuário previamente cadastrado', () => {
          let aluno = `Aluno EBAC ${Math.floor(Math.random() * 100000000)}`
          cy.cadastrarUsuario(token, aluno, 'fulano@qa.com.br', 'teste123')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": aluno,
                              "email": faker.internet.email(),
                              "password": faker.internet.password(),
                              "administrador": "true",
                         },
                    }).then(response => {
                         expect(response.body.message).to.equal('Cadastro realizado com sucesso')

                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let aluno = `Aluno EBAC ${Math.floor(Math.random() * 100000000)}`
          cy.cadastrarUsuario(token, aluno, 'amandasilva@qa.com.br', 'teste123')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)

                    })
               })
     });
});

