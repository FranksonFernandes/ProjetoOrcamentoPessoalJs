class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validaDados(){
        //Percorre os atributos e valores dos objetos
        for(let i in this){
            
        //Verifica se estão vazios, nulos ou indefinidos:
            if(this[i]== undefined || this[i]== '' || this[i]==null){
                
                return false
            }
          
         }
            return true 
        
    }

}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
     gravar(d){
        
       let id = this.getProximoId()
       localStorage.setItem(id, JSON.stringify(d)) 
       localStorage.setItem('id',id)


       }
       recuperarTodosRegistros(){
           let despesas = Array() 

           let id = localStorage.getItem('id')
        //Recuperar todas as despesas cadastradas em local storage:
           for(let i =1; i<=id;i++){
               //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i)) 
            //verificar indices  que foram pulados/removidos
            //Se houver, será pulado:
            if(despesa === null){
                continue
            }

            despesas.push(despesa)
        }
        return despesas
       }

       pesquisar(despesa){
        let despesasFiltradas = Array()   
        despesasFiltradas = this.recuperarTodosRegistros()
        
        //Filtrando ano:
        if(despesa.ano!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.mes == despesa.mes)
        }
        // dia
        if(despesa.dia!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.dia == despesa.dia)
        }
        //Tipo
        if(despesa.tipo!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.tipo == despesa.tipo)
        }
        //Descrição
        if(despesa.descricao!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor!=''){
            despesasFiltradas = despesasFiltradas.filter(d=> d.valor == despesa.valor)
        }

        return despesasFiltradas

       }

}

let bd = new Bd()

function cadastrarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value,
        descricao.value, 
        valor.value
        )

        if(despesa.validaDados()){
             bd.gravar(despesa)
            document.getElementById('modal_titulo').innerHTML = 'Registrado com sucesso!' 
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'
            document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
            document.getElementById('modal_btn').innerHTML = 'Ok'
            document.getElementById('modal_btn').className = 'btn btn-success'
            //dialog de sucesso
             $('#modalRegistraDespesa').modal('show')
             ano.value = ''
             mes.value = ''
             dia.value = ''
             tipo.value = ''
             descricao.value = ''
             valor.value = ''

        } else{
            //dialog de erro
            document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro!' 
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
            document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação do registro, verifique se todos os campos foram preenchidos!'
            document.getElementById('modal_btn').innerHTML = 'Corrigir'
            document.getElementById('modal_btn').className = 'btn btn-danger'
            $('#modalRegistraDespesa').modal('show')
            
        }
        
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    
    if(despesas.length ==0 && filtro==false){
        despesas = bd.recuperarTodosRegistros()
    }
    
    //selecionando o elementi tbody da tabela:
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML =''

    //percorrer o array despesas, listando cada despesa de forma dinamica:
    despesas.forEach(function(d){

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()
        //criar as colunas (td)
        linha.insertCell(0).innerHTML =`${d.dia}/${d.mes}/${d.ano}`//tratando a coluna de data (dd/mm/yyyy)
        
        //Ajustar o TIPO:
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break    
            case '3': d.tipo = 'Lazer'
                break        
            case '4': d.tipo = 'Saúde'
                break            
            case '5': d.tipo = 'Transporte'
                break            
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        if(d.valor===undefined){
            d.valor='0,00'
        }
        linha.insertCell(3).innerHTML = d.valor
    })

}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)
    
    carregaListaDespesas(despesas, true)

}

