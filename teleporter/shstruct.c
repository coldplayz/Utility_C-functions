#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))

/**
 * shstruct - serves as a storage for shell_t struct that can
 * be accessed by any calling function. This works, as functions are
 * external/global-scope objects, and Betty prohibits the use of global variables.
 * @shell: address of the shell_t struct to store.
 *
 * Return: the address of the currently stored struct.
 */
shell_t *shstruct(shell_t *shell)
{
	static shell_t *sp1;

	if (shell)
	{
		sp1 = shell;
	}

	return (sp1);
}
