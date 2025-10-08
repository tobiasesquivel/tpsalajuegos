import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayorMenorService } from '../../servicios/mayor-menor.service';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css']
})
export class MayorOMenorComponent implements OnInit {
  constructor(public mayorMenorService: MayorMenorService) {}

  ngOnInit(): void {
    this.mayorMenorService.iniciarJuego();
  }
}
