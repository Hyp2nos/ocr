import { Component } from '@angular/core';
import {createWorker } from 'tesseract.js';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 worker: Tesseract.Worker;
 workerReady = false;
 image = '../../assets/modele-facture-proforma.png';  //'https://tesseract.projectnaptha.com/img/eng_bw.png';
 ocrResult = '';
 totalHT:number =0;
 totalTVA=0;
 total=0;
 captureProgress = 0;
 date = '';
 numeroDeFact = '';

  constructor(
    public loadingCtrl: LoadingController,
    public toastController: ToastController
  ) {
    this.loadWorker();
  }

  async loadWorker(){
    this.worker = createWorker({
      logger: progress => {
        console.log(progress);
        if(progress.status == 'recognizing text'){
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      }
    });
  

    await this.worker.load();
    await this.worker.loadLanguage('fra');
    await this.worker.initialize('fra');
    await this.worker.setParameters({});
    
    console.log('fin');
    this.workerReady = true;
  }

  async recognizeImage(){

      const loading = await this.loadingCtrl.create({
      message: 'loading..',
      showBackdrop: true,
      spinner: 'circles'
    });

    await loading.present();
     const result = await this.worker.recognize(this.image);
     console.log(result);
     let re = /,/gi;
    let re2 = /—/gi;
     let re3 = /\n/gi;
     this.ocrResult = result.data.text.replace(re,".");
     this.ocrResult = result.data.text.replace(re2," ");
     this.ocrResult = result.data.text.replace(re3," ");
    
     if((this.ocrResult.includes("HT") && this.ocrResult.includes("TVA"))|| (this.ocrResult.includes("TVA") && this.ocrResult.includes("TTC"))|| (this.ocrResult.includes("tva") && this.ocrResult.includes("ttc") ) || (this.ocrResult.includes("invoice") && this.ocrResult.includes("ttc")&& this.ocrResult.includes("tva")) ){
        
        
          const resultArray =this.ocrResult.split(" ");
       
        
        for (let i = 0; i < resultArray.length; i++) {
          const element = resultArray[i];
          console.log(i +" " +element.toLowerCase());
         
          //Total HT1 ---------------------------------------
          if(element.toLowerCase() ==="total" || element.toLowerCase() ==="totai" || element.toLowerCase() === "montant" ){
            if (resultArray[i+ 1].toLowerCase() === "ht") {
               if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                 this.totalHT = parseFloat(resultArray[i+1+1]);
               }
               else{
                 if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                   this.totalHT = parseFloat(resultArray[i+1+1+1]);
                 }
                 else{
                    if (!isNaN(parseFloat(resultArray[i+1+1+1+1]))) {
                      this.totalHT = parseFloat(resultArray[i+1+1+1+1]);
                    }
                 }
               }
            }
            else if (resultArray[i+1+1].toLowerCase() === "ht") {
              if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                this.totalHT = parseFloat(resultArray[i+1+1+1])
              }
              else{
                if (!isNaN(parseFloat(resultArray[i+1+1+1+1]))) {
                  this.totalHT = parseFloat(resultArray[i+1+1+1+1])
                }
                else{
                  if (!isNaN(parseFloat(resultArray[i+1+1+1+1+1]))) {
                    this.totalHT = parseFloat(resultArray[i+1+1+1+1+1])
                  }
                }
              }
            }
          }
           
          //Total Ht 2 ------------------------------------ 
           if(element.toLowerCase() ==="totalht" || element.toLowerCase() === "totaiht" ){    
                  
               if (!isNaN(parseFloat(resultArray[i+1]))) {
                 this.totalHT = parseFloat(resultArray[i+1]);
               }else{
                 if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                    this.totalHT = parseFloat(resultArray[i+1+1]);
                 }else{
                   if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                     this.totalHT = parseFloat(resultArray[i+1+1+1])
                   }
                 }
               }
          } 
          //TOTAL TVA-----------------------------------
           if (element.toLowerCase()==="total") {
             if (resultArray[i+1].toLowerCase() === "tva") {
               if (resultArray[i+1+1].toLowerCase().indexOf('%') !== -1) {
                  if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                  this.totalTVA = parseFloat(resultArray[i+1+1+1]);    
                  }
                  else{
                  if(!isNaN(parseFloat(resultArray[i+1+1+1+1]))) {
                    this.totalTVA = parseFloat(resultArray[i+1+1+1+1]);
                  }
                 }
                }
               else{
                  if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                  this.totalTVA = parseFloat(resultArray[i+1+1]);    
                  }
                  else{
                  if(!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                    this.totalTVA = parseFloat(resultArray[i+1+1+1]);
                  }
                 }
               } 
            }
          }
          //TVA 2
           if (element.toLowerCase() === "tva") {
               if (resultArray[i+1].toLowerCase().indexOf('%') !== -1) {
                  if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                  this.totalTVA = parseFloat(resultArray[i+1+1]);    
                  }
                  else{
                  if(!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                    this.totalTVA = parseFloat(resultArray[i+1+1+1]);
                  }
                 }
                }
               else{
                  if (!isNaN(parseFloat(resultArray[i+1]))) {
                  this.totalTVA = parseFloat(resultArray[i+1]);    
                  }
                  else{
                  if(!isNaN(parseFloat(resultArray[i+1+1]))) {
                    this.totalTVA = parseFloat(resultArray[i+1+1]);
                  }
                 }
               } 
            }
            //Total TVA 2
            if(element.toLowerCase() ==="totaltva" || element.toLowerCase() === "totaitva" ){    
                  
               if (!isNaN(parseFloat(resultArray[i+1]))) {
                 this.totalTVA = parseFloat(resultArray[i+1]);
               }else{
                 if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                    this.totalTVA = parseFloat(resultArray[i+1+1]);
                 }else{
                   if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                     this.totalTVA = parseFloat(resultArray[i+1+1+1])
                   }
                 }
               }
          } 

         //Total ---------------------------------------------------
          if (element.toLowerCase() === "total"|| element.toLowerCase() === "totai" || element.toLowerCase() === "totalttc" ) {
            if (!isNaN (parseFloat(resultArray[i+1]))) {
              this.total = parseFloat(resultArray[i+1]);
            }
            else{
              if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                this.total = parseFloat(resultArray[i+1+1])
              }
              else{
                if (!isNaN(parseFloat(resultArray[i+1+1+1]))) {
                  this.total = parseFloat(resultArray[i+1+1+1])
                }
                else{
                  if (!isNaN(parseFloat(resultArray[i+1+1+1+1]))) {
                    this.total = parseFloat(resultArray[i+1+1+1+1])
                  }
                }
              }
            }
          }
          if (element.toLowerCase() === "total") {
            if (resultArray[i+1].toLowerCase() === "ttc") {
               if (!isNaN(parseFloat(resultArray[i+1+1]))) {
                 this.total = parseFloat(resultArray[i+1+1])
               }
            }
          }

          if (element.toLowerCase() === "total") {
            if (resultArray[i+1+1].toLowerCase() === "de" ) {
              if (resultArray[i+1+1+1].toLowerCase() === "la" ) {
                if (resultArray[i+1+1+1+1].toLowerCase() === "facture" ) {
                  if (!isNaN(parseFloat(resultArray[i+1+1+1+1+1]))) {
                    this.total = parseFloat(resultArray[i+1+1+1+1+1])
                  }
                }   
              }
            }
            else{
              
            }
          }

        //Date --------------------------------------------------------------------    
           if (element.toLowerCase() === "date" && this.date == '' && resultArray[i+1].toLowerCase() !== "de") {
            this.date = resultArray[i+1]
          } else{
            if (element.toLowerCase() === "date" && resultArray[i+1].toLowerCase() === "de" ) {
              if (resultArray[i+1+1].toLowerCase() === "la" ) {
                 if (resultArray[i+1+1+1].toLowerCase() === "facture" ) {
                   if (resultArray[i+1+1+1+1].toLowerCase() ) {
                     if (typeof resultArray[i+1+1+1+1+1] === "string") {
                       this.date = resultArray[i+1+1+1+1+1]
                     }
                   }
                 }
              }
            }

            else{
              /* if (resultArray[i+1+1].toLowerCase() === "de" ) {
                
              } */
            }
          }
          
          //Numero de facture--------------------------------------------------------
          if (element.toLowerCase() === "n°" || element.toLowerCase() === "numéro" || element.toLowerCase() === "référence" ) {
            if (resultArray[i+1].toLowerCase() === "de") {
              if (resultArray[i+1+1].toLowerCase() === "facture" ) {
                 this.numeroDeFact = resultArray[i+1+1+1]
              }
            }
          }

           if (element.toLowerCase() === "n°" || element.toLowerCase() === "numéro" || element.toLowerCase() === "référence" ) {
            if (resultArray[i+1].toLowerCase() === "de") {
              if (resultArray[i+1+1].toLowerCase() === "la" ) {
                if (resultArray[i+1+1+1].toLowerCase() === "facture") {
                   this.numeroDeFact = resultArray[i+1+1+1+1]
                }   
              }
            }
          }

          if (element.toLowerCase() === "facture") {
            if (resultArray[i+1].toLowerCase() === "n°" || resultArray[i+1].toLowerCase() === "numéro"  ) {
              this.numeroDeFact = resultArray[i+1+1]
            }
          }

        }

        if (this.total === 0 && this.totalHT !== 0 && this.totalTVA !== 0) {
          this.total = this.totalHT + this.totalTVA;
        }
        if (this.totalTVA === 0 && this.totalHT !== 0 && this.total !==0) {
          this.totalTVA = this.total - this.totalHT;
        }
     
      await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'transaction ajoutée! ',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
     alert("total TVA :" + this.totalTVA);
     alert("Total HT final :" + this.totalHT);
     alert("Total final :" + this.total);
     alert("Numero de facture :" + this.numeroDeFact);
     alert("date :" + this.date);
     }

     else{
        console.log("ce n'est pas un facture");
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: ' ☣ une erreur est survenue, ressayer! ',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
     }
  }
}
