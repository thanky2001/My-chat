import React, { Component } from 'react';
import '../../Css/rename.css';
export default class Rename extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            values:{
                editName:'',
                image:'',
            },
            errors:{
                editName:'',
                image:''
            },
        }
    }
    handleChange=(e)=>{
        let errorMessage='';
        if(e.target.value.trim()===''){
            errorMessage='Không được để trống';
        }
        let value={...this.state.values,[e.target.name]:e.target.value}
        let error={...this.state.errors,[e.target.name]:errorMessage}
        this.setState({
            errors:error,
            values:value,
        })
    }
    checkErrors=()=>{
        let {values,errors}=this.state;
        let valid=true;
        for(let key in values){
            if(values[key]===''){
                valid=false;
            }
        }
        for(let key in errors){
            if(errors[key]!==''){
                valid=false;
            }
        }
        //Thành công
        if(valid){
            let {renameUser}=this.props;
            renameUser(this.state.values.editName,this.state.values.image);
            alert('Thành công rồi');
        }else{
            alert('Không được để trống');
            return;
        }
    }
    render() {
        return (
            <div>
                {/* Modal */}
                <div className="modal fade" id="modelId" tabIndex={-1} role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm thông tin</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form >
                                    <span>Name: </span>
                                    <input
                                        placeholder={this.state.values.editName}
                                        name="editName" 
                                        type="text"
                                        onBlur={this.handleChange}
                                        onChange={this.handleChange}
                                    />
                                    <p className='text-danger'>{this.state.errors.editName}</p>
                                    <br/><br/>
                                    <span>Url Image: </span>
                                    <input
                                        placeholder={this.state.values.image}
                                        name="image"
                                        type="text"
                                        onBlur={this.handleChange}
                                        onChange={this.handleChange}
                                    />
                                    <p className='text-danger'>{this.state.errors.image}</p>
                                    <button onClick={this.checkErrors} type="submit" className="btn btn-primary float-right" data-dismiss="modal" >Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
