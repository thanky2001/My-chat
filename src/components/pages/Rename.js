import React, { Component } from 'react';
import '../../Css/rename.css';
export default class Rename extends Component {
    constructor(props) {
        super(props);
        this.state={
            editName:'',
            image:''
        }
    }
    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value,
        })
        
    }
    render() {
        let {user,renameUser}=this.props;
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
                                <form>
                                    <span>Name: </span>
                                    <input
                                        placeholder={user.name}
                                        name="editName" 
                                        type="text"
                                        onChange={this.handleChange}
                                    /><br/><br/>
                                    <span>Url Image: </span>
                                    <input
                                        placeholder={user.image}
                                        name="image"
                                        type="text"
                                        onChange={this.handleChange}
                                    />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={()=>renameUser(this.state.editName,this.state.image)} >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
