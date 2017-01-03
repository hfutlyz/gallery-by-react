require('normalize.css/normalize.css');
require('styles/base.scss');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片数据
let imageDatas = require('../data/imageDatas.json');
// 利用自执行函数，将图片的信息转换为图片的url信息
imageDatas = ((imageDatasArr) => {
  for (let i = 0; i < imageDatasArr.length; i++) {
    let singleImageData =  imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

// 获取区间内的随机值
function getRangeRandom(low,high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
// 获取一个随机的角度值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + getRangeRandom(5,35));
}

const ImgFigure = React.createClass({
  //点击
  handleClick(e){
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },
  render () {
    let styleObj = {};
    // 如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0,添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moztransform','msTransform','WebkitTransform','transform'])
      .forEach((value) => {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate+ 'deg)';
      });
    }
    let imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    return (
      <figure className={imgFigureClassName} style={styleObj}
        onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
});

// 控制组件
const ControllerUnit = React.createClass({
  handleClick(e){
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },
  render () {
    let controllerUnitClassName = "controller-unit";
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += " is-center";
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse";
      }
    }
    return (
      <span className= {controllerUnitClassName}
        onClick={this.handleClick}></span>
    );
  }
});

const AppComponent = React.createClass({
  getInitialState: function() {
    return {
      imgsArrangeArr:[
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   },
        //   // 旋转
        //   rotate:0,
        //   // 是否被旋转反转
        //   isInverse:false
        //   // 是否居中
        //   isCenter:false
        // }
      ]
    };
  },
  Constant:{
    centerPos:{
      left:'0',
      right:'0'
    },
    //水平方向的取值范围
    hPosRange:{
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    //垂直方向的取值范围
    vPosRange:{
      x:[0,0],
      topY:[0,0]
    }
  },
  // 反转图片
  // @param index 输入当前被执行的inverse操作的图片对应的图片信息组的index值
  // @return {Function} 这是一个闭包函数,其内return一个真正待被执行的函数
  inverse(index){
    return function () {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  },
  // 利用 rearrange函数,居中对应的index的图片
  // @param index 需要被居中的图片信息数组的index的值
  // @return {Function}
  center(index){
    return function () {
      this.rearrange(index);
    }.bind(this);
  },
  // 重新布局所有图片
  // @param centerIndex 指定居中图片
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        // 上侧区域图片,取0或1个
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        // 这个图片在整个数组的位置
        topImgSpliceIndex = 0,
        // 居中图片
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        // 首先居中centerIndex图片
        imgsArrangeCenterArr[0] = {
          pos:centerPos,
          rotate:0,
          isCenter:true
        };
        // 取出要布局的上侧图片的状态消息
        topImgSpliceIndex = Math.ceil(Math.random() *
        (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach((value,index) => {
          imgsArrangeTopArr[index] = {
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };

        });
        // 布局左右两侧的图片信息
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j;i++) {
          // 左区域或右区域的取值范围
          let hPosRangLORX = null;
          // 前半部分布局左边,后半部分布局右边
          if (i < k) {
            hPosRangLORX = hPosRangeLeftSecX;
          } else {
            hPosRangLORX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos : {
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangLORX[0],hPosRangLORX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        }
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  },
  // 组件加载以后,为每张图片计算其位置的范围
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);
    // 拿到imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };
    // 计算左右区域,图片排布取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域,图片排布取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - halfImgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  },
  render() {
      let controllerUnits = [];
      let imgFigures = [];
      imageDatas.forEach((value,index) => {
        if (!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos:{
                left:'0',
                top:'0'
            },
            rotate:0,
            isInverse:false,
            isCenter:false
          };
        }
        imgFigures.push(<ImgFigure key={'imgFigure'+index} data={value}
        ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}/>
        );
        controllerUnits.push(<ControllerUnit key={'controllerUnit'+index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}/>);
      });

      return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

AppComponent.defaultProps = {
};

export default AppComponent;
