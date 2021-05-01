import './App.css';
import 'jquery/dist/jquery';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/modal';
import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {currentView:0, items: [{Id:1, Description:"This is an element", Title: "Portfolio", Postponed: false, Completed: false}, {Id:2, Description:"This is an element", Title: "Help", Postponed: false, Completed: false}, {Id:3, Description:"This is an element", Title: "More", Postponed: false, Completed: false}]};
  }
  setContainerValue = (value)=>{
    this.setState({currentView: value});
  }
  render(){
    return (
      <div className="App">
        <NavigationBar value="ToDo App" onSubmitChild={this.setContainerValue}/>
        <Container items={this.state.items} value={this.state.currentView}/>
      </div>
    );
  }
}

class NavigationBar extends React.Component{
  constructor(props){
    super(props)
    this.state = {NavItems: [{Name: "Home", Active: true}, {Name: "About", Active: false}]}
  }
  submitViewId(viewId){
    let items = this.state.NavItems.slice();
    items.forEach((element, index) => {
      element.Active = index === viewId ? true: false;
    })
    this.setState({NavItems: items});
    this.props.onSubmitChild(viewId);
  }
  render(){
    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand custom-navbar-item" href="/">{this.props.value}</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle Navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {this.state.NavItems.map((item, index) => {
            let classes = item.Active ? "nav-link active": "nav-link";
            return(
            <li key={index} className="nav-item">
              <a href="/#" className={classes} onClick={() => this.submitViewId(index)}>{item.Name}</a>
            </li>);
          })}
        </ul>
      </div>
    </nav>
    );
  }
}

class Container extends React.Component{
  render(){
    let view;
    switch(this.props.value){
      case 0:
        view = (<Dashboard items={this.props.items} />);
        break;
      case 1:
        view = (<AboutView/>);
        break;
      default:
        view = (<Dashboard items={this.props.items}/>);
        break;
    }
    return (view);
  }
}
function AboutView(){
  return (
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className="display-4"><p>About</p></div>
      </div>
      <div className="col-12">
        <p>Sample React.js project developed by Juan Guerrero</p>
      </div>
    </div>
  </div>);
}

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {items:props.items};
    this.updateItem = this.updateItem.bind(this);
  }
  updateItem = (value, type)=>{
    let newItems = this.state.items.slice();
    this.setState({items: []}, () => {
      if(type===1) newItems[value].Postponed = true;
      if(type===2){
        newItems[value].Completed = true;
        newItems.splice(value, 1);
      }
      this.setState({items:newItems}, ()=>console.log(this.state.items));
    });
  }
  renderCardItems(){
    return (this.state.items.sort((item, i)=>{ return item.Postponed && item.Id }).map((item, i) => {
      return (<CardItem key={i} value={{index: i, item: item}} onSubmitChild={this.updateItem} />);
    }));
  }
  onClickAddTask(){
    $('#modalCenter').modal('show');
  }
  saveTask = (item) =>{
    console.log("entro a");
    let newItems = this.state.items.slice();
    let maxId = this.state.items.reduce((item1, item2) => item2.Id > item1.Id ? item2: item1).Id;
    item.Id = maxId + 1;
    newItems.push(item);
    this.setState({items:newItems}, ()=>console.log(this.state.items));
  }
  render(){
    return (
    <div className="container-fluid">
      <br/>
      <div className="row">
        <div className="col-12 col-sm-9 col-md-10 col-lg-10">
          
        </div>
        <div className="col-12 col-sm-3 col-md-2 col-lg-2">
          <button className="btn btn-block btn-primary" onClick={() => this.onClickAddTask()}>Add task</button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h1 className="display-4">To do</h1>
        </div>
        {this.renderCardItems()}
        <AddTaskModal onSubmitChild={this.saveTask}/>
      </div>
    </div>
    );
  }
}
class AddTaskModal extends React.Component{
  constructor(props){
    super(props);
    this.state = { Id:0, Description:"", Title: "", Postponed: false, Completed: false};
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }
  saveTask(){
    this.props.onSubmitChild(this.state);
    this.setState({ Id:0, Description:"", Title: "", Postponed: false, Completed: false});
    $('#modalCenter').modal('hide');
  }
  handleDescriptionChange(event){
    let state = this.state;
    state.Description = event.target.value;
    this.setState(state);
  }
  handleTitleChange(event){
    let state = this.state;
    state.Title = event.target.value;
    this.setState(state);
  }
  render(){
    return(
      <div className="modal fade" id="modalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="modalLongTitle">Nombre: </h5>&nbsp;<input type="text" value={this.state.Title} onChange={this.handleTitleChange} />
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <h6>Descripcion</h6>
        <br/>
        <textarea value={this.state.Description} onChange={this.handleDescriptionChange}></textarea>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={() => this.saveTask()}>Add</button>
      </div>
    </div>
  </div>
</div>
    );
  }
}
class CardItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {item: props.value.item, index: props.value.index};
  }
  submitPostponedItem(index, type){
    this.props.onSubmitChild(index, type);
  }
  submitCompletedItem(index, type){
    this.props.onSubmitChild(index, type);
  }
  render(){
    return (
      <div key={this.state.index} className="col-12 col-sm-4 col-md-4 col-lg-4">
        <div className="card">
          <div className="card-header">
            <h3>{this.state.item.Title}</h3>
          </div>
          <div className="card-body">
            {this.state.item.Description}
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-6">
                <PostponeButton key={"postpone_"+this.state.index} value={{item:this.state.item}} onClick={()=> this.submitPostponedItem(this.state.index, 1)}/>
              </div>
              <div className="col-6">
                <CheckButton key={"check_"+this.state.index} value={{item:this.state.item}} onClick={() => this.submitCompletedItem(this.state.index, 2)}/>
              </div>
            </div>
          </div>
        </div>
        <br/>
      </div>);
  }
}
class CheckButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {item: props.value.item};
  }
  render(){
    return (
      <div className="btn btn-block btn-success" disabled={this.state.item.Completed} onClick={() => this.props.onClick()}>
        Completed
      </div>
      );
  }
}
class PostponeButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {item: props.value.item};
  }
  render(){
    return(<button className="btn btn-block btn-warning" disabled={this.state.item.Postponed} onClick={() => this.props.onClick()}>Postpone</button>);
  }
}

export default App;
