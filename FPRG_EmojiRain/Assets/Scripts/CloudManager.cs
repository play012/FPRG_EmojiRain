using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CloudManager : MonoBehaviour
{
    public string lastEmoji;

    [SerializeField] GameObject canvasGO, emojiGO;
    [SerializeField] CollisionManager collManager;

    Vector3 dir;
    float speed;
    string[] emojiList;
    bool emojisSpawned;

    void Start() {
        dir = Vector3.left;
        speed = 3f;
        emojisSpawned = true;
        emojiList = new string[] {"angry", "surprised", "sad", "happy"};
    }

    void Update() {
        if(collManager.hitCounter != -1) {
            transform.Translate(dir*speed*Time.deltaTime);

            if(transform.position.x < -5.75f) {
                dir = Vector3.right;
                speed = Random.Range(3f, 10f);
                emojisSpawned = false;
            } else if(transform.position.x > 5.75f) {
                dir = Vector3.left;
                speed = Random.Range(3f, 10f);
                emojisSpawned = true;
            }

            if(transform.position.x >= 0.001f && !emojisSpawned) {
                emojisSpawned = true;
                int randEmoji = Random.Range(0, emojiList.Length);
                float randPos = Random.Range(-250f, 250f);
                lastEmoji = emojiList[randEmoji];
                var videoPlayer = emojiGO.transform.GetChild(0).transform.GetChild(0).GetComponent<UnityEngine.Video.VideoPlayer>();
                videoPlayer.url = Path.Combine(Application.streamingAssetsPath, lastEmoji + ".webm");
                GameObject emojiInst = Instantiate(emojiGO, new Vector3(randPos, 280f, 0f), Quaternion.identity);
                emojiInst.transform.SetParent(canvasGO.transform, false);
                emojiInst.GetComponent<FallingStatus>().isFalling = true;
            }
        }
    }
}
