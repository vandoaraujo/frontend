import React from  'react'
import MaskedInput from 'react-text-mask';

export default props =>
    <div className="form">
    <div className="row">
        <div className="col-8 col-md-8">
            <div className="form-group">
                <label>Nome</label>
                <input type="text" className="form-control"
                    name="name" value={this.state.user.name}
                    onChange={e => this.updateField(e)}
                    placeholder="Digite o nome..."/>
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>CEP</label>
                <MaskedInput
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                className="form-control"
                placeholder="Enter cep"
                guide={false}
                value={this.state.user.cep}
                name="cep"
                onChange={e => this.updateAdress(e)}/>
                <button className="btn btn-warning"
                    onClick={() => this.buscarCEP()}>
                    <i className="fa fa-search"></i>
                </button    >
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col-6 col-md-6">
            <div className="form-group">
                <label>Endereço</label>
                <input type="text" className="form-control"
                name="endereco" 
                value={this.state.user.endereco}
                onChange={e => this.updateField(e)}
                />
            </div>
        </div>

        <div className="col-1 col-md-1">
            <div className="form-group">
                <label>Número</label>
                <input type="text" className="form-control"
                    name="numero" value={this.state.user.numero}
                    onChange={e => this.updateField(e)}
                    />
            </div>
        </div>

        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>Bairro</label>
                <input type="text" className="form-control"
                    name="bairro" value={this.state.user.bairro}
                    onChange={e => this.updateField(e)}
                    />
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col-3 col-md-3">
            <div className="form-group">
                <label>Complemento</label>
                <input type="text" className="form-control"
                name="complemento" 
                value={this.state.user.complemento}
                onChange={e => this.updateField(e)}
                />
            </div>
        </div>

        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>UF</label>
                <select className="form-control" name="uf"
                value={this.state.user.uf} 
                onChange={e => this.updateField(e)} >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                    <option value="ES">Estrangeiro</option>
                </select>
            </div>
        </div>

        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>Cidade</label>
                <input type="text" className="form-control"
                    name="cidade" value={this.state.user.cidade}
                    onChange={e => this.updateField(e)}
                    />
            </div>
        </div>
    </div>


    <div className="row">
        <div className="col-3 col-md-3">
            <div className="form-group">
                <label>Celular</label>
                <MaskedInput
                mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className="form-control"
                placeholder="Digite o celular"
                guide={false}
                value={this.state.user.telefone}
                name="telefone"
                onChange={e => this.updateAdress(e)}/>

            </div>
        </div>

        <div className="col-3 col-md-3">
            <div className="form-group">
                <label>E-mail</label>
                <input type="email" className="form-control"
                name="email" 
                value={this.state.user.email}
                onChange={e => this.updateField(e)}
                placeholder="Digite o email..."
                />
            </div>
        </div>

        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>Data Nascimento</label>
                <input type="date" className="form-control"
                    name="dataNascimento" value={this.state.user.dataNascimento}
                    onChange={e => this.updateField(e)}
                    placeholder="Digite a Data de nascimento..."/>
            </div>
        </div>

    </div>

    <div className="row">
        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>Sexo</label>
                <select className="form-control"
                    name="sexo" value={this.state.user.sexo}
                    onChange={e => this.updateField(e)} >
                    <option value="">Informe...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
                
            </div>
        </div>

        <div className="col-2 col-md-2">
            <div className="form-group">
                <label>Estado Civil</label>
                <select className="form-control" name="estadoCivil"
                value={this.state.user.estadoCivil}
                    onChange={e => this.updateField(e)} >
                    <option value="">Informe...</option>
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Separado">Separado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viúvo">Viúvo</option>
                    <option value="Amasiado">Amasiado</option>
                </select>
            </div>
        </div>
    </div>

    { this.state.showConjuge ? 

    <div className="row" >
        <div className="col-8 col-md-8">
            <div className="form-group">
                <label>Nome Cônjuge</label>
                <input type="text" className="form-control"
                name="conjuge" 
                value={this.state.user.conjuge}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome do conjuge..."
                />
            </div>
        </div>  
    </div>

    : null }


    <div className="row">
        <div className="col-3 col-md-3">
            <div className="form-group">
                <label>Escolaridade</label>
                <select className="form-control" name="escolaridade"
                    value={this.state.user.escolaridade}
                    onChange={e => this.updateField(e)}>
                    <option value="">Informe...</option>
                    <option value="ensino-fundamental">Ensino fundamental</option>
                    <option value="ensino-fundamental-incompleto">Ensino fundamental incompleto</option>
                    <option value="ensino-medio">Ensino médio</option>
                    <option value="ensino-medio-incompleto">Ensino médio incompleto</option>
                    <option value="ensino-superior">Ensino superior</option>
                    <option value="ensino-superior-incompleto">Ensino superior incompleto</option>
                </select>
            </div>
        </div>

        <div className="col-3 col-md-3">
            <div className="form-group">
                <label>Profissão</label>
                <input type="text" className="form-control"
                name="profissao" 
                value={this.state.user.profissao}
                onChange={e => this.updateField(e)}
                />
            </div>
        </div>
    </div>
    <hr />
    <div className="row">
        <div className="col-12 d-flex justify-content-start">
            <button className="btn btn-primary"
                onClick={e => this.save(e)}>
                Salvar
            </button>

            <button className="btn btn-secondary ml-2"
                onClick={e => this.clear(e)}>
                Cancelar
            </button>
        </div>   
    </div>  
    </div>