
  function AddRow(tableId : string, name:string, readonly:boolean){
    var table: HTMLTableElement =  <HTMLTableElement>document.getElementById(tableId);
    var nbRows = table.rows.length;
    var newRow = table.insertRow(nbRows);
    
    var newCell = newRow.insertCell(0);
    var element = document.createElement("input");
    element.type = "number";
    element.step = "any"
    element.id = name + nbRows;
    element.readOnly = readonly;
    newCell.appendChild(element);
    return element;
  }

  function DeleteLastRow(tableId : string){
    var table: HTMLTableElement =  <HTMLTableElement>document.getElementById(tableId);
    if(table.rows.length > 1) { table.deleteRow(-1); } 
  }

  function AddInputRow(){
    AddRow('tabpieces', "piece", false);                             
    AddRow('tabajust', "ajust", true);                             
    AddRow('tabajust2', "ajustii", true);                             
  }

  function DeleteInputRow(){
    DeleteLastRow('tabpieces');                             
    DeleteLastRow('tabajust');                             
    DeleteLastRow('tabajust2');                             
  }

  function Adjust(){
    var marges : number = 2 * parseFloat((<HTMLInputElement>document.getElementById('marge')).value);
    var S : number = parseFloat((<HTMLInputElement>document.getElementById('reele')).value);  // S = souhaitée
    var P : number = parseFloat((<HTMLInputElement>document.getElementById('normalisee')).value); // P = prévu par le patron

    var totalPièces : Float64Array = CheckPieces(marges);
    var T : number = totalPièces.reduce((a, b) => { return a + b; });  //Somme de toutes les pièces (sans marge)
    var N : number = (T * S) / P;   // Règle de 3 -> Longeur totale necessaire 
    
    var coeff:number = (N -T) / T; // N - T = longeur totale de l'ajustement (à repartir proportionelement à la taille de chaque pièce => / T)
    var color: string = (coeff<0)? "red":"green";
    for (let i: number = 0; i < totalPièces.length; i++)
    {
      var cell: HTMLInputElement = <HTMLInputElement>document.getElementById("ajust" + (i+1));
      cell.value = (totalPièces[i] * coeff).toFixed(2);
      cell.style.color = color;
      var cell2: HTMLInputElement = <HTMLInputElement>document.getElementById("ajustii" + (i+1));
      cell2.value = ((totalPièces[i] * coeff) / 2).toFixed(2);
      cell2.style.color = color;
    }
  }

  function CheckPieces(marges: number){
    var nbPieces = (<HTMLTableElement>document.getElementById("tabpieces")).rows.length - 1;
    var x = new Float64Array(nbPieces);
    for (let i : number = 1; i <= nbPieces; i++)  
    {  
      var vs = (<HTMLInputElement>document.getElementById("piece"+i)).value;
      if (vs =="") { alert('Vous devez specifier les longueurs de toutes les pièces!'); break; }        
      var v = parseFloat(vs);
      if (v <= marges) { alert('Vous devez specifier des longueurs de pièce superieures à la marge de couture!'); break;}        
      x[i-1] = v-marges;
    }          
    return x; // Retourne les tailles des pièces sans les marges
  }

  function marge_change(){
    var marge : number = parseFloat((<HTMLInputElement>document.getElementById('marge')).value);
    if (Number.isNaN(marge)) 
    {
      (<HTMLInputElement>document.getElementById('margesuffix')).textContent = " ?";
    }
    else
    {
      (<HTMLInputElement>document.getElementById('margesuffix')).textContent = " soit un total de " + (marge*2).toFixed(2) + " cm";
    }
  }