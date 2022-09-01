#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <signal.h>
#include <dirent.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))


/**
 * handle_dpfree - handles the freeing of a double pointer to char.
 * @sarr: the address of the double pointer to free.
 *
 * Description: the pointers in sarr are each pointing to a dynamically
 * allocatd memory space that need to be free'd, as well as sarr itself.
 */
void handle_dpfree(char ***sarr)
{
	int i;

	for (i = 0; (*sarr)[i]; i++)
	{
		free((*sarr)[i]);
	}

	free(*sarr);
}
