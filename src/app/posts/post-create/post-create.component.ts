import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./mime-type.validator";
import { Subscription } from 'rxjs';

import { PostsService } from "../posts.service";
import { IPost } from "../post.model";
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})


export class PostCreateComponent implements OnInit, OnDestroy{

  private mode = 'create';
  private postId: string;
  post: IPost;
  isLoading = false;
  form: FormGroup;  //agrupa todos los controles del formularioo
  imagePreview: string;
  private authStatusSub: Subscription;

  //default metodo generico que no guarda relacion con angular, lo manej javascript
  //siempre se ejecuta cuando se crea una clase
  constructor(
      public postService: PostsService,
      public route: ActivatedRoute,
      public authService: AuthenticationService){

  }

  //componente de angular que se ejecuta luego del constructor
  //pertenece al ciclo de vida de angular y es donde se indica que el
  //componente est listo para su uso
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(authStatus => {
          this.isLoading = false;
        });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required,
                     Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });   //los null son valores iniciales del campo, en este caso vacio

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')){
        console.log("entro en updated");
        this.mode = "update";
        this.postId = paramMap.get("postId");
        console.log("id= ", this.postId);
        this.isLoading = true; //spinner aparece
        this.postService.getPost(this.postId)
                        .subscribe(postData => {
                          this.isLoading = false; //spinner desaparce porque hay ahay resultado
                          this.post = {
                            id: postData._id,
                            title: postData.title,
                            content: postData.content,
                            imagePath: postData.imagePath,
                            creator: postData.creator
                          };
        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
          image: this.post.imagePath
        }); //setea los valores en los campos
      });
      } else {
        console.log("entro en created");
        this.mode = "create";
        this.postId = null;
      }
    });  //escucha los cambios que hayan en los parametros en el url
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    console.log("file=", file);
    this.form.patchValue({ image: file }); //permite apuntar a un solo control
    this.form.get("image").updateValueAndValidity(); //informa a angular que se cambio el valor y debera reevaluarlo, almacenar el valor internamente y verifica el valor del patch esta bien
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; //cuando termine de leer el archivo e indica que tiene que cargarlo
    };
    reader.readAsDataURL(file);       //carga el archivo
  }

  onSavePost(){

    if (this.form.invalid){
      return;
    }

  this.isLoading = true;

    if (this.mode === "create"){
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatepost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
