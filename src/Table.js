import React, {useState, useEffect} from 'react';
import './Table.css';
import cardBack from './img/cardBack.png'
import ReactPlayer from "react-player";
import Modal from "react-modal";


export const Table = () => {

  const [deck, setDeck] = useState();
  const [initialCardsDeck, setInitialCardsDeck] = useState();
  const [gameFlag, setGameFlag] = useState(false);
  const [userHand, setUserHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealer1stHand, setDealer1stCard] = useState([]);
  const [userTotal, setUserPoints] = useState();
  const [dealerTotal, setDealerPoints] = useState();
  const [dealerMessage, setDealerMessage] = useState();
  const [userMessage, setUserMessage] = useState();
  const [resultMessage, setResultMessage] = useState();
  const [flag, toggleFlag] = useState(false);
  const [chips, setChips] = useState(600);
  const [bet, setBet] = useState(0);
  const [previousChips, setPreviousChips] = useState();
  const [doubleValueFlag, setDoubleValueFlag] = useState(false);
  const [openModal, setModal] = useState(false);
 

  const pushBackValue = bet / 2;

  //デッキ作成
  useEffect(() => {

    const getCardsData = async() => {
      const response = await fetch(
        "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
      );
      const cardsData = await response.json();
      let initialCards = cardsData.cards.splice(0,4)

      setDeck(cardsData)
      setInitialCardsDeck(initialCards)
    }
    getCardsData();
    

  },[gameFlag])

  //更新毎のディーラー・ユーザーの手札計算・PUSH時の計算
  useEffect(() => {

    if(userHand.length > 0) {
      userCalculation()
    }

    if(dealerHand.length > 2 ) {
      dealerCalcultion()
    }

    if(dealerTotal > 21) {
      setDealerMessage("BUST")
    }

    judge(userTotal, dealerTotal)

    if(resultMessage === "Dealer Win" && chips === 0){
      setResultMessage("GAME OVER")
    
    }

    if(userTotal > 0 && dealerTotal > 0) {
      if(userTotal === dealerTotal){
        setResultMessage("PUSH BACK")
        setChips(previousChips + pushBackValue)
      }
    }

    },[userHand, dealerHand, userTotal, dealerTotal,flag])

  //ディール・ジャッジ
  useEffect(() => {

  if(chips === 0 && resultMessage === "Dealer Win"){
      setResultMessage("GAME OVER")
    
    }else if(resultMessage === "Dealer Win"){
      setChips(previousChips)
    
    }else if(resultMessage === "You Win" && doubleValueFlag === true){
      setChips(previousChips + ((bet*1.5)*2))

    }else if(resultMessage === "You Win"){
      setChips(previousChips + (bet*2))
    }

  },[resultMessage])

  //カードの分配・チップ処理
  const distributingCards = () => {

       setUserHand(userHand => userHand.concat(initialCardsDeck[0], initialCardsDeck[2]))
       setDealer1stCard(dealer1stHand => dealer1stHand.concat(initialCardsDeck[1]))
       setDealerHand(dealerHand => dealerHand.concat(initialCardsDeck[1],initialCardsDeck[3]))
       setChips(chips - bet)
       setPreviousChips(chips - bet)

  };

  //ユーザー：HIT
  const hit = () => {

    setUserHand(userHand => userHand.concat(deck.cards[0]))
    deck.cards.shift()
    setDeck(deck)

  }

  const doubleDown = (deck) => {

    setUserHand(userHand => userHand.concat(deck.cards[0]))
    deck.cards.shift()
    setChips(chips - bet)
    setPreviousChips(chips - bet)
    setDoubleValueFlag(true)
    passDealerTurn()

  }

  //STAND・DOUBLE DOWNコマンド後、ディーラーターンへ遷移
  const passDealerTurn = () => {

    toggleFlag(true)
    userCalculation()
    dealerCalcultion()

  }

  //ユーザーの計算
  const userCalculation = () => {
 
    let userPoints = 0;

    for(let i = 0; i < userHand.length; i++) {
      if (userHand[i].value === "JACK" || userHand[i].value === "QUEEN" || userHand[i].value === "KING"|| userHand[i].value === 10) {
        userPoints +=  10;
      }else if (userPoints > 10 && userHand[i].value === "ACE") {
        userPoints +=  1;
      } else if (userHand[i].value === "ACE") {
        userPoints +=  11;
      } else {
        userPoints += Number(userHand[i].value)
      }
    }

    setUserPoints(userPoints)
    
    if(userHand[0].value === "JACK" || userHand[0].value === "QUEEN" || userHand[0].value === "KING"|| userHand[0].value === 10 ){
      if(userHand[1].value === "ACE"){
        setUserMessage("BLACK JACK")
      }
    }

    if(userHand[0].value === "ACE"){
      if(userHand[1].value === "JACK" || userHand[1].value === "QUEEN" || userHand[1].value === "KING"|| userHand[1].value === 10 ){
      setUserMessage("BLACK JACK")
      }
    }

    if(userPoints > 21) {
      setUserMessage("BUST")
    }

  }

  //ディーラーの計算
  const dealerCalcultion = () => {

    let dealerPoints = 0;
    for(let i = 0; i < dealerHand.length; i++) {
      if (dealerHand[i].value === "JACK" || dealerHand[i].value === "QUEEN" || dealerHand[i].value === "KING"|| dealerHand[i].value === 10) {
        dealerPoints +=  10;
      }else if (dealerPoints > 10 && dealerHand[i].value === "ACE") {
        dealerPoints +=  1;
      } else if (dealerHand[i].value === "ACE") {
        dealerPoints +=  11;
      } else {
        dealerPoints += Number(dealerHand[i].value)
      }
    }

      if(dealerHand[0].number === "JACK" || dealerHand[0].number === "QUEEN" || dealerHand[0].number === "KING"|| dealerHand[0].number === 10 ){
        if(dealerHand[1].number === "ACE"){
          setDealerMessage("BLACK JACK")
        }
      }

      if(dealerHand[0].number === "ACE"){
        if(dealerHand[1].number === "JACK" || dealerHand[1].number === "QUEEN" || dealerHand[1].number === "KING"|| dealerHand[1].number === 10 ){
        setDealerMessage("BLACK JACK")
        }
      }

    setDealerPoints(dealerPoints)
    if(userTotal > 21) {
      setResultMessage("Dealer Win")
    }else if(dealerTotal > 21){
      setResultMessage("You Win")
      setDealerMessage("BUST")
    }else if(dealerPoints > 17) {
      setDealerPoints(dealerPoints)
    }else if(dealerPoints < 17) {
      dealerHit(deck)
    }

  }

  //16以下であれば、ディーラーは強制的にHIT
  const dealerHit = () => {

    setDealerHand(dealerHand => dealerHand.concat(deck.cards[0]))
    deck.cards.shift()
    setDeck(deck)

  }

  //勝敗の決定
  const judge = (userTotal, dealerTotal) =>{

    if (userTotal > 21){
      setResultMessage("Dealer Win")
    }else if (dealerTotal > 21 ){
      setResultMessage("You Win")
    }else if (userTotal > dealerTotal && userMessage !== "BUST"){
      setResultMessage("You Win")
    }else if (dealerTotal > userTotal && dealerMessage !== "BUST"){
      setResultMessage("Dealer Win")
    }

  }

  //ディール後、新しいディールを開始
  const newDeal = () => {
  
  setGameFlag(!gameFlag)
  setDeck([]);
  setUserHand([]);
  setDealerHand([]);
  setDealer1stCard([]);
  toggleFlag(false);
  setUserPoints();
  setDealerPoints();
  setDealerMessage();
  setUserMessage();
  setResultMessage("");
  setBet(0);
  setChips(chips);
  setDoubleValueFlag(false)
  }

  //Wallet：０の際、新しいゲームをスタートする
  const newGame = () => {

    setGameFlag(!gameFlag)
    setDeck([]);
    setUserHand([]);
    setDealerHand([]);
    setDealer1stCard([]);
    toggleFlag(false);
    setUserPoints();
    setDealerPoints();
    setDealerMessage();
    setUserMessage();
    setResultMessage("");
    setBet(0);
    setChips(600);
    setDoubleValueFlag(false)

    }

    const modalStyle = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.1)"
      },
      content: {
        position: "absolute",
        width: "50%",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "1em"
      }
    };

  return (
    <>
    <div className="Table">
        <div className="money">
            <div className="chips">{chips < 0 ? <div>Chips：$0</div> : <div>Chips：${chips}</div> }</div>
            <div className="bet-value">{!userTotal && <div>Your BET：${bet}</div>}</div>
        </div>

        <div className="field">

        <div className = "dealerSide">
            {flag ? 
              [...dealerHand].map((card, index) => (
                <>
                <td className = "dealerHands" key={index}>
                <img className = "dealerCards" src={card.image} alt={card.code} />
                </td>
                </>
              ))
            :
              dealer1stHand.map((card, index) => (
                <>
                <td className = "dealerHands" key={index}>
                <img className = "dealerCards" src={card.image} alt={card.code} />
                <img className = "cardBack" src={cardBack} alt="CardBack"></img>
                </td>
                </>
              ))

            }
            <p className="dealerMessage">{dealerMessage}</p>
            <p className="dealerPointArea">Dealer：{dealerTotal}</p>
        </div>
        
        <div className="result"><p>{resultMessage}</p></div>

        <div className="commands">
          {!resultMessage || resultMessage === "GAME OVER" || 
              <button className="button" disabled={chips < 0 || chips === 0} onClick ={() => {newDeal()}}>New Deal</button>
          }

          {resultMessage === "GAME OVER" &&
              <button className="button" onClick ={() => newGame()}>Reset GAME</button>
          }

          {!bet || userTotal > 0 || 
              <button className="button" disabled={!bet || userTotal} onClick ={() => {distributingCards()}}>BET</button>}

          {userTotal > 0 && !resultMessage && userMessage !== "BLACK JACK" &&
              <button className="button" disabled={resultMessage || !userTotal} onClick ={() => {hit(deck)}}>HIT</button>
          }
          
          {userTotal > 0 && !resultMessage &&
              <button className="button" disabled={resultMessage || !userTotal} onClick ={() => {passDealerTurn()}}>STAND</button>
          }

          {userTotal > 0 && !resultMessage && userHand.length < 3 && userMessage !== "BLACK JACK" &&
           <button className="button" disabled={resultMessage || !userTotal} onClick ={() => {doubleDown(deck)}}>DOUBLE DOWN</button>
          }
        </div>

        <div className = "userSide">
        <p className="pointArea">&nbsp;&nbsp;User：{userTotal}&nbsp;</p>
          <p className = "userMessage">{userMessage}</p>

         {[...userHand].map((card, index) => (
         <div className = "userHands" key={index}>
            <img className = "userCards"　src={card.image} alt={card.code} />
         </div>
        ))}
        </div>

          {!userTotal  ? 
          <div className="betCommands">
          <button className="btn" disabled={chips < 1} onClick ={() => setBet(bet + 1)}>&nbsp;$1&nbsp;</button>
          <button className="btn" disabled={chips < 30} onClick ={() => setBet(bet + 30)}>$30</button>
          <button className="btn" disabled={chips < 50} onClick ={() => setBet(bet + 50)}>$50</button>
          <button className="btn" disabled={chips < 100} onClick ={() => setBet(bet + 100)}>$100</button>
          </div>
          :<div></div>
          }

        </div>

          <footer>
            <div className="modal">
            <button className="tutorial-button" onClick={() => setModal(true)}></button>
            <Modal isOpen={openModal} style={modalStyle}  onRequestClose={() => setModal(false)}>
            {/* <button onClick={() => setModal(false)}>
                <FontAwesomeIcon className="tutorial-close-button" icon={faTimesCircle} />
            </button> */}
            <div className="tutorial">
            <h1 >BLACK JACKの遊び方</h1>
            </div>
            <div className="tutorial-discription">
            <p>これはディーラーとあなたの勝負です。</p>
            <p>手札の合計が"21"に近い方が勝ちです。</p>
            <p>チップがなくなると、GAME OVERです。</p>
            <p>"21"を超えた場合、BUSTとなり強制的に「負け」が確定します。</p>
            <p>ディーラーは手札の合計が17以下の場合、強制的にカードをドローします。</p>
            </div>
            <div className="tutorial-hands">
            <p>・HIT：カードを１枚手札に加えます</p>
            <p>・STAND：あなたのターンを終えます</p>
            <p>・DOUBLE DOWN：１枚だけ手札に加え、掛け金を２倍にし、あなたのターンを終えます</p>
            </div>
            </Modal>
            </div>

            {/* <div className="player">
            <ReactPlayer
              url="./saloon piano/Armadillo's Saloon Piano Song 1.mp3"
              width="200px"
              height="40px"
              playing={true}
              loop={true}
              controls={true}
              volume={0.1}
            /> */}
            {/* </div> */}
    　　　 </footer>
    </div>
    </>
  );
}

