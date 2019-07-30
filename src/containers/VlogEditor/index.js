import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Toolbar, Hamburger, ConfirmProfessional, EditTitle, EditFade, SelectAsset, SelectSong} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar, Icon, Toggle, Segment, Spinner} from '../../atoms';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';

@withRouter
@inject('overlay')
@inject('vlogEditor')
@inject('project')
@observer
export default class VlogEditor extends Component {
  constructor(props) {
    super(props);
    this.resumableRef = React.createRef();
    this.state = {
      pending: true,
      hamburgerActive: false,
      syncing: false
    };
    window.globalobject = this;
  }

  componentWillMount() {
    const {id} = this.props.match.params;
    const professional = this.props.location.search.includes('professional=true');
    if (!id) {
      this.props.project.createProject(professional)
      .then(id => this.props.history.replace(`/edit-vlog/${id}`));
      window.id = id;
    } else {
      window.id = id;
      this.props.project.setProject(id)
      .then(() => this.setState({pending: false}, () => {
        if(!window.cordova){
          this.props.vlogEditor.initResumable(id, this.resumableRef.current);
          this.resumableRef.current.children[0].accept = 'video/*'; 
        }else{
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, test);
          function test() {  window.globalobject.props.vlogEditor.initResumable(window.id, window.globalobject.resumableRef.current);
          }
        }
          
      }
      ));
    }
  }

  //** function for cordova */
 docameraupload() {
    //see: https://github.com/vsivsi/meteor-file-collection/issues/29
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

function gotFS(fs){
  window.fs = fs;
navigator.device.capture.captureVideo(captureSuccess,function(error){
console.log(error);
},{
limit: 1
}); 

document.addEventListener('pendingcaptureresult', function(mediaFiles) {
  console.log("pending capture called");
});

function captureSuccess(mediaFiles){
  var i, path, len;
      //var formdata = new FormData();
       // filesList = [];
  //to do met blobs: https://stackoverflow.com/questions/49324145/ionic-3-post-camera-image-to-api-with-cordova-plugin-file
  //https://www.neontribe.co.uk/cordova-file-plugin-examples/
  //https://stackoverflow.com/questions/38832592/cordova-file-plugin-save-file-in-device
  //https://stackoverflow.com/questions/52034945/cordova-plugin-file-good-on-dev-app-error-code-1-on-live-app-but-only-on-andr
  
  for(i = 0; i < mediaFiles.length; i += 1) {
  path = mediaFiles[i].fullPath;

  window.resolveLocalFileSystemURL(path, resolvesuc, resolveerr);
  }
  
  
    
      function resolvesuc(fileEntry) {

      console.log('cdvfile URI: ' + fileEntry.toInternalURL());
      console.log('succes'+fileEntry.name);
     // var objectURL = window.URL.createObjectURL(fileEntry);
      //console.log("Objecturl:"+objectURL);
      var url2 = fileEntry.toInternalURL();
      var url3 = fileEntry.toURL();
      var url4 = fileEntry.fullPath;
      console.log("url4:"+url4);
     // var newurl = url3.replace('file:///storage/emulated/0/','cdvfile://localhost/persistent/');
        window.fs.root.getFile(url4, { create: false}, function (fileEntry) {
          fileEntry.file(function (file) {
            const fileReader = new FileReader();
          
             fileReader.onload = ev => {
              let formData = new FormData();
              let fileblob = new Blob([new Uint8Array(fileReader.result)], { type: file.type });
              fileblob.name = file.name;
              window.globalobject.props.vlogEditor.initCordovaResumable(window.id, fileblob);
          }
          fileReader.readAsArrayBuffer(file);

        });
    });
          
        //	filesList.push(url2);
    // var reader = new FileReader();
        
     /*     reader.onerror = function (error) {
  
          alert(JSON.stringify(error));
  
          };
          
        reader.onloadend = function(event) {
           var blob = new Blob([new Uint8Array(reader.result)], {type : 'video/mp4'});
           
           blob.name = fileEntry.name;
          // formdata.append('blob', blob, fileEntry.name);
           filesList.push(blob);
           alert("result"+reader.result+event.target.result+blob);
        //var nativeupload = $('#fileupload').fileupload({url: url});
        var jqXHR = $('#fileupload').fileupload('send', {files: filesList});
      
         };
          fs.root.getFile(objecturl, { create: false}, function (fileEntry) {
          fileEntry.file(function (file) {
            file.fullPath = url3;
            alert(file.type); //image/jpeg
            alert(file.fullPath);
            alert(file.size);
            reader.readAsArrayBuffer(file);
            }, function(err) {
        alert('error='+err);
      });
        }, function (err){
          alert("getfilerror"+JSON.stringify(err));
        });
        /*
        var reader2 = new FileReader();
         
          reader2.onloadend = function(event) {
          var blob = reader2.result;
          alert("reader2:"+event.target.result);
          alert("blob:"+blob);
          //formdata.append('blob', blob, fileEntry.name);
          blob.name = fileEntry.name; 
          filesList.push(blob);
          
        var jqXHR = $('#fileupload').fileupload('send', {files: filesList});
  
        };
      fileEntry.file(function (file) {
         reader2.readAsDataURL(file); 
           }, function(err) {
        alert('error='+err);
      });
         /*
         var reader3 = new FileReader();
         reader3.onloadend = function(evt) {
             var base64 = window.btoa(evt.target.result);
           
         }
         reader3.readAsBinaryString(file);*/
    
       
  }
    //var url = server+'upload/server/php/';
    //var nativeupload = $('#fileupload').fileupload({url: url});
  
      
  function resolveerr(error) {
    console.log('ERROR:'+error);
  }
  
  
  }

}

function fail(){
concolse.log("Fail in Filesystem Request");
}
}
/** END CORDOVA */

  componentWillUnmount() {
    this.props.match.params.id && this.props.project.updateProject({
      media: JSON.stringify(this.props.vlogEditor.media.toJS().map(this.props.project.reduceMediaObj))
    });
  }

  confirmProfessional = () => {
    this.props.overlay.openOverlay(ConfirmProfessional)({onSelect: this.toggleCustomEdit})();
  }

  toggleCustomEdit = () => {
    this.props.project.toggleOption('custom_edit')();
    this.props.project.updateProject({options: JSON.stringify(this.props.project.options)});
  }

  toggleHamburger = () => this.setState({hamburgerActive: !this.state.hamburgerActive})

  sync = () => !this.state.syncing && this.props.vlogEditor.syncMedia();

 

  getActions = () => {
  
    if(window.cordova){

  return [
  
    {
      icon: 'camcorder',
      render: <div
        className={classNames(styles.vidinput, this.props.vlogEditor.uploading && styles.disabled)}
        id="input"
      >
        {this.props.vlogEditor.uploading ? 'Uploading...' : 'Camera'}
      </div>,
      fn: this.docameraupload
    },
    {
      icon: 'addVlog',
      render: <div
        ref={this.resumableRef}
        className={classNames(styles.vidinput, this.props.vlogEditor.uploading && styles.disabled)}
        id="input"
      >
        {this.props.vlogEditor.uploading ? 'Uploading...' : 'Video'}
      </div>,
      fn: noop
    },
    {
      icon: 'fade',
      render: <div>Fade</div>,
      fn: this.props.overlay.openOverlay(EditFade)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'title',
      render: <div>Title</div>,
      fn: this.props.overlay.openOverlay(EditTitle)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'asset',
      render: <div>Branding</div>,
      fn: this.props.overlay.openOverlay(SelectAsset)({onSave: this.props.vlogEditor.addMedia})
    }
  ]
}else{
  return [
    {
      icon: 'camcorder',
      render: <div
        ref={this.resumableRef}
        className={classNames(styles.vidinput, this.props.vlogEditor.uploading && styles.disabled)}
        id="input"
      >
        {this.props.vlogEditor.uploading ? 'Uploading...' : 'Video'}
      </div>,
      fn: noop
    },
    {
      icon: 'fade',
      render: <div>Fade</div>,
      fn: this.props.overlay.openOverlay(EditFade)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'title',
      render: <div>Title</div>,
      fn: this.props.overlay.openOverlay(EditTitle)({onSave: this.props.vlogEditor.addMedia})
    },
    {
      icon: 'asset',
      render: <div>Branding</div>,
      fn: this.props.overlay.openOverlay(SelectAsset)({onSave: this.props.vlogEditor.addMedia})
    }
  ]
  }
}

  nextStep = () => {
    const error = this.props.vlogEditor.getErrors();
    if (error) {
      this.props.overlay.showToast(error)();
    } else {
      this.props.vlogEditor.syncMedia()
      .then(() => this.props.history.push(`/configure-vlog/${this.props.match.params.id}`));
    }
  }

  renderHint = () => (
    <React.Fragment>
      <Icon className={styles.backdrop} name="backdrop" />
      <Icon className={styles.arrow} name="arrowCurved" />
    </React.Fragment>
  )

  render() {
    const {uploading, progress, media, syncing, cancelUpload} = this.props.vlogEditor;
    const {projectId, options, song, setSong} = this.props.project;
    const custom_edit = options ? options.custom_edit : false;
    const {hamburgerActive, pending} = this.state;
    const {className} = this.props;
    return pending ? <Spinner /> : (
      <div className={classNames(styles.container, className)}>
        {isEmpty(media) && this.renderHint()}
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} onCancel={cancelUpload} />
        <FontAwesome className={styles.hamburger} name="bars" onClick={this.toggleHamburger} />
        <div className={styles.sync} onClick={this.sync}>
          <FontAwesome className={classNames(styles.syncIcon, syncing && styles.syncing)} name="save" />
          <div className={styles.syncLabel}>{syncing ? 'Syncing' : 'Synced'}</div>
        </div>
        <Arranger />
        <Toolbar
          className={styles.toolbar}
          actions={this.getActions()}
          allowNext={media.some(mediaObj => ['video', 'title', 'asset'].includes(mediaObj.mediatype))}
          next={this.nextStep}
        />
        <Hamburger active={hamburgerActive} onClose={this.toggleHamburger}>
          <Segment title="Vlog Data">
            <div className={styles.option}>
              <div>Vlog ID</div>
              <div>{`#${projectId}`}</div>
            </div>
          </Segment>
          <Segment title="Extra's">
            <div className={styles.option}>
              <div>Professional Vlog</div>
              <Toggle
                className={styles.customToggle}
                value={custom_edit}
                onChange={custom_edit ? this.toggleCustomEdit : this.confirmProfessional}
              />
            </div>
          </Segment>
          <Segment title="Music">
            <SelectSong selected={song} onChange={setSong} shouldPlay={hamburgerActive} />
          </Segment>
        </Hamburger>
      </div>
    );
  }
}
