//起動時の呼び出し関数
window.addEventListener("load", () => {
    //ステージを整える
    initialize();
    //ゲーム開始
    loop();
    }
);

//ゲームの現在の状況
let mode;
//ゲームの現在のフレーム（1/60秒ごとに1を追加
let frame;
//連鎖カウント
let combinationCount = 0;

function initialize(){
    //画像の準備
    PuyoImage.initialize();
    //ステージの準備
    Stage.initialize();
    //ユーザ操作の準備
    Player.initialize();
    //シーンを初期状態にセット
    Score.initialize();
    //スコア表示の準備
    mode = 'start';
    //フレームの初期化
    frame = 0;
}

function loop(){
    switch(mode) {
        //開始
        case 'start':
            //もしかしたら空中にあるかもしれないぷよを自由落下させるところからスタート
            mode = 'checkFall';
            break;
        //落下判定
        case 'checkFall':
            //落ちる場合、落下モードにする
            if(Stage.checkFall()) {
                mode = 'fall';
            }
            //落ちない場合は、ぷよ消し判定
            else {
                mode = 'checkErase';
            }
            break;
        //落下
        case 'fall':
            //全て落下後、ぷよ消し判定へ
            if(!Stage.fall()){
                mode = 'checkErase';
            }
            break;
        //ぷよ消し判定
        case 'checkErase':
            const eraseInfo = Stage.checkErase(frame);
            if(eraseinfo){
                mode = 'erasing';
                combinationCount++;
                //得点計算
                Score.calculateScore(combinationCount, eraseInfo.piece, eraseInfo.color);
                Stage.hideZenkeshi();
            }
            else{
                if(Stage.puyoCount == 0 && combinationCount > 0){
                    //全消し処理
                    Stage.showZenkeshi();
                    Score.addScore(3600);
                }
                combinationCount = 0;
                //消せなかったら新しいぷよを登場させる
                mode = 'newPuyo'
            }
            break;
        case 'erasing':
            //消し終わったら、再度落下判定
            if(!Stage.erasing(frame)){
                mode = 'checkFall';
            }
            break;
        case 'newPuyo':
            if(!Player.createNewPuyo()){
                //新しい操作用ぷよを作成できない場合は、ゲームオーバー
                mode = 'gameOver';
            }
            else{
                //プレイヤーが操作可能
                mode = 'playing';
            }
        case 'playing':
            //プレイヤーが操作する
            const action = Player.playing(frame);
            mode = action;  //playing moving rotating fix のいずれかがセット
            break;
        case 'moving':

    }
}